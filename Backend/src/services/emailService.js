const nodemailer = require('nodemailer')
const EmailList = require('../models/EmailList') // Ensure you require your model
const templates = require('../emailTemplates/templates')

/**
 * Helper function to safely retrieve value from a Map or an object.
 */
const getMapValue = (map, key) => {
  if (map instanceof Map) {
    return map.get(key)
  }
  return map[key]
}

/**
 * Fetch recipients from EmailList based on role.
 *
 * For the "PIs" role, specify piType to choose among 'email', 'Co-PI', or 'Team-members'.
 *
 * @param {string} role - Role name (e.g., 'grantAdmins', 'grantManagers', 'PIs')
 * @param {string|null} division - Division name if applicable
 * @param {string} piType - For PIs role, which sub-type to fetch. Defaults to 'email'.
 * @returns {Promise<Array>}
 */
const getRecipientsByRole = async (role, division = null, piType = 'email') => {
  try {
    const emailList = await EmailList.findOne()
    if (!emailList) return []

    if (role === 'grantAdmins') {
      // grantAdmins is stored as an array.
      return emailList.grantAdmins.map((entry) => entry.email)
    } else if (role === 'grantManagers') {
      // grantManagers is stored as a Map (or plain object) where each key is a division.
      if (division) {
        const divisionEmails = getMapValue(emailList.grantManagers, division) || []
        return divisionEmails.map((entry) => entry.email)
      } else {
        // If no division is specified, combine emails from all divisions.
        let emails = []
        const gm = emailList.grantManagers
        if (gm instanceof Map) {
          for (let [div, entries] of gm.entries()) {
            emails.push(...entries.map((entry) => entry.email))
          }
        } else {
          for (const div in gm) {
            emails.push(...gm[div].map((entry) => entry.email))
          }
        }
        return emails
      }
    } else if (role === 'PIs') {
      // PIs is stored as a nested Map: division → (PI name → { email, "Co-PI", "Team-members" }).
      if (division) {
        const divisionPIs = getMapValue(emailList.PIs, division)
        if (!divisionPIs) return []
        let emails = []
        if (divisionPIs instanceof Map) {
          for (let [piName, piData] of divisionPIs.entries()) {
            const recipients = piData[piType] || []
            emails.push(...recipients.map((entry) => entry.email))
          }
        } else {
          for (const piName in divisionPIs) {
            const recipients = divisionPIs[piName][piType] || []
            emails.push(...recipients.map((entry) => entry.email))
          }
        }
        return emails
      } else {
        // If no division specified, combine emails across all divisions.
        let emails = []
        const pis = emailList.PIs
        if (pis instanceof Map) {
          for (let [div, divisionPIs] of pis.entries()) {
            if (divisionPIs instanceof Map) {
              for (let [piName, piData] of divisionPIs.entries()) {
                const recipients = piData[piType] || []
                emails.push(...recipients.map((entry) => entry.email))
              }
            } else {
              for (const piName in divisionPIs) {
                const recipients = divisionPIs[piName][piType] || []
                emails.push(...recipients.map((entry) => entry.email))
              }
            }
          }
        } else {
          for (const div in pis) {
            for (const piName in pis[div]) {
              const recipients = pis[div][piName][piType] || []
              emails.push(...recipients.map((entry) => entry.email))
            }
          }
        }
        return emails
      }
    } else {
      // Fallback: if the role is stored as an array.
      if (Array.isArray(emailList[role])) {
        return emailList[role].map((entry) => entry.email)
      }
      return []
    }
  } catch (error) {
    console.error('❌ Error fetching recipients:', error)
    return []
  }
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

console.log('email user -', process.env.EMAIL_USER)

/**
 * Send an email using a predefined template.
 *
 * @param {string} templateKey - Template name from `templates.js`
 * @param {object} data - Data to populate the template
 * @param {Array} recipients - List of recipient emails
 */
const sendEmailByTemplate = async (templateKey, data, recipients) => {
  if (!templates[templateKey]) {
    console.error(`❌ Template '${templateKey}' not found!`)
    return
  }

  if (!recipients || recipients.length === 0) {
    console.warn(`⚠️ No recipients provided for template '${templateKey}'`)
    return
  }

  const mailOptions = {
    from: `"Grant Management" <${process.env.EMAIL_USER}>`,
    to: recipients.join(', '),
    subject: templates[templateKey].subject,
    text: templates[templateKey].text(data),
    html: templates[templateKey].html(data),
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`📧 Email sent to ${recipients.join(', ')}: ${info.response}`)
  } catch (error) {
    console.error('❌ Failed to send email:', error)
  }
}

module.exports = { sendEmailByTemplate, getRecipientsByRole }
