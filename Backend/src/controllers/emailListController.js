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

    // Helper: Combine nested keys for PIs and teamMembers into one emails array per division.
    // This function will iterate through all nested keys (like "New PI") and merge their emails.
    const combineNestedEmails = (groups) => {
      const result = {}
      for (const division in groups) {
        let combinedEmails = []
        for (const subKey in groups[division]) {
          if (groups[division][subKey] && Array.isArray(groups[division][subKey].emails)) {
            combinedEmails.push(...formatEmails(groups[division][subKey].emails))
          }
        }
        result[division] = { emails: combinedEmails }
      }
      return result
    }

    const { grantAdmins, grantManagers, PIs, teamMembers, additionalData } = req.body

    let emailLists = await EmailList.findOne()
    if (!emailLists) {
      emailLists = new EmailList()
    }

    // Replace previous data with the new data from payload.
    emailLists.grantAdmins = formatEmails(grantAdmins || [])

    // For grantManagers, build a new object and assign a new Map.
    const formattedGrantManagers = {}
    for (const division in grantManagers || {}) {
      formattedGrantManagers[division] = formatEmails(grantManagers[division] || [])
    }
    emailLists.grantManagers = new Map(Object.entries(formattedGrantManagers))

    // Process PIs: Combine nested keys into one emails array per division and then replace.
    const formattedPIs = combineNestedEmails(PIs || {})
    emailLists.PIs = new Map(Object.entries(formattedPIs))

    // Process teamMembers similarly.
    const formattedTeamMembers = combineNestedEmails(teamMembers || {})
    emailLists.teamMembers = new Map(Object.entries(formattedTeamMembers))

    // Replace additionalData.
    emailLists.additionalData = additionalData || {}

    // Mark fields as modified so that Mongoose detects the updates.
    emailLists.markModified('grantAdmins')
    emailLists.markModified('grantManagers')
    emailLists.markModified('PIs')
    emailLists.markModified('teamMembers')

    await emailLists.save()

    res.json({ message: 'Email lists saved successfully!' })
  } catch (error) {
    console.error('❌ Error saving email lists:', error)
    res.status(500).json({ error: 'Failed to save email lists' })
  }
}
