const EmailList = require('../models/EmailList')

exports.getEmailLists = async (req, res) => {
  try {
    let emailLists = await EmailList.findOne()
    if (!emailLists) {
      emailLists = new EmailList()
      await emailLists.save()
    }
    res.json(emailLists)
  } catch (error) {
    console.error('Error fetching email lists:', error)
    res.status(500).json({ error: 'Failed to fetch email lists' })
  }
}

exports.saveEmailLists = async (req, res) => {
  try {
    // Helper: Format emails so that each entry is an object with email and enabled fields.
    const formatEmails = (emails) => {
      if (!Array.isArray(emails)) return []
      return emails.map((email) => (typeof email === 'string' ? { email, enabled: true } : email))
    }

    // Map payload keys to match the model fields.
    // The payload may use keys like "Grant admins" or "Grant Managers"
    const payloadGrantAdmins = req.body['Grant admins'] || req.body.grantAdmins || []
    const payloadGrantManagers = req.body['Grant Managers'] || req.body.grantManagers || {}
    const payloadPIs = req.body.PIs || {}
    const payloadAdditionalData = req.body.additionalData || {}

    let emailLists = await EmailList.findOne()
    if (!emailLists) {
      emailLists = new EmailList()
    }

    // Process grantAdmins: expecting an array of email entries.
    emailLists.grantAdmins = formatEmails(payloadGrantAdmins)

    // Process grantManagers: expecting an object whose keys are division names and values are arrays.
    const formattedGrantManagers = {}
    for (const division in payloadGrantManagers) {
      formattedGrantManagers[division] = formatEmails(payloadGrantManagers[division] || [])
    }
    // Assign as a plain object; Mongoose will cast it to a Map.
    emailLists.grantManagers = formattedGrantManagers

    // Process PIs:
    // Expected shape: an object with division keys. Each division is an object with PI names as keys.
    // Each PI value should be an object with keys "email", "Co-PI", and "Team-members" (arrays).
    const formattedPIs = {}
    for (const division in payloadPIs) {
      const divisionPIs = payloadPIs[division]
      const formattedDivisionPIs = {}
      for (const piName in divisionPIs) {
        const piData = divisionPIs[piName]
        formattedDivisionPIs[piName] = {
          email: formatEmails(piData.email || []),
          'Co-PI': formatEmails(piData['Co-PI'] || []),
          'Team-members': formatEmails(piData['Team-members'] || []),
        }
      }
      formattedPIs[division] = formattedDivisionPIs
    }
    // Assign as a plain object; Mongoose will cast it to a nested Map structure.
    emailLists.PIs = formattedPIs

    // Process additionalData.
    emailLists.additionalData = payloadAdditionalData

    // Mark fields as modified so Mongoose detects the updates.
    emailLists.markModified('grantAdmins')
    emailLists.markModified('grantManagers')
    emailLists.markModified('PIs')
    emailLists.markModified('additionalData')
    console.log(emailLists.grantAdmins)
    await emailLists.save()

    res.json({ message: 'Email lists saved successfully!' })
  } catch (error) {
    console.error('❌ Error saving email lists:', error)
    res.status(500).json({ error: 'Failed to save email lists' })
  }
}
