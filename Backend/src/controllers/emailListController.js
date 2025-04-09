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

// GET /api/email-lists/pi-team?email=<pi_email>
exports.getPITeam = async (req, res) => {
  const { email } = req.query

  console.log('🔍 Searching for PI with email:', `"${email}"`)

  try {
    const emailListDoc = await EmailList.findOne()

    if (!emailListDoc) {
      return res.status(404).json({ message: 'Email list document not found.' })
    }

    // Convert outer Map
    const PIs = Object.fromEntries(emailListDoc.PIs || [])
    console.log(`📦 Total Divisions in PIs: ${Object.keys(PIs).length}`)

    for (const division of Object.keys(PIs)) {
      console.log(`📁 Searching division: ${division}`)

      // Convert inner Map for each division
      const divisionPIs = Object.fromEntries(PIs[division])

      for (const piName of Object.keys(divisionPIs)) {
        const piEntry = divisionPIs[piName]
        console.log(`👤 Checking PI: ${piName}`)

        if (!piEntry || typeof piEntry !== 'object') {
          console.log(`⚠️ Skipping PI "${piName}" – invalid structure.`)
          continue
        }

        const emailList = Array.isArray(piEntry.email) ? piEntry.email : []
        console.log(`📨 Emails for "${piName}":`, emailList.map((e) => e.email).join(', '))

        const match = emailList.find(
          (entry) => entry.email?.toLowerCase().trim() === email.toLowerCase().trim()
        )

        if (match) {
          console.log(`✅ Match found! PI: "${piName}" in Division: "${division}"`)
          return res.json({
            division,
            piName,
            coPIs: piEntry['Co-PI'] || [],
            teamMembers: piEntry['Team-members'] || [],
          })
        }
      }
    }

    console.log('❌ No match found. PI not in database.')
    return res.status(404).json({ message: 'PI not found.' })
  } catch (err) {
    console.error('🔥 Error fetching PI team:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

// PUT /api/email-lists/pi-team
exports.savePITeam = async (req, res) => {
  const { email, coPIs, teamMembers } = req.body

  console.log('💾 Attempting to save team for email:', `"${email}"`)

  try {
    const emailListDoc = await EmailList.findOne()

    if (!emailListDoc) {
      console.log('❌ Email list document not found.')
      return res.status(404).json({ message: 'Email list document not found.' })
    }

    const PIs = emailListDoc.PIs

    if (!PIs || !(PIs instanceof Map)) {
      console.log('❌ PIs is not a Map.')
      return res.status(500).json({ message: 'Invalid PI structure.' })
    }

    const formatList = (list) =>
      list.map((entry) => ({
        email: entry.email?.trim().toLowerCase(),
        enabled: true,
      }))

    for (const [division, piMap] of PIs.entries()) {
      console.log(`📁 Searching division: ${division}`)

      if (!(piMap instanceof Map)) continue

      for (const [piName, piEntry] of piMap.entries()) {
        console.log(`👤 Checking PI: ${piName}`)

        const emailList = Array.isArray(piEntry?.email) ? piEntry.email : []

        const match = emailList.find(
          (entry) => entry.email?.toLowerCase().trim() === email.toLowerCase().trim()
        )

        if (match) {
          console.log(`✅ Found PI. Updating "${piName}" in "${division}"`)

          piEntry['Co-PI'] = Array.isArray(coPIs) ? formatList(coPIs) : []
          piEntry['Team-members'] = Array.isArray(teamMembers) ? formatList(teamMembers) : []

          emailListDoc.markModified(`PIs.${division}.${piName}`)
          await emailListDoc.save()

          return res.json({ message: 'Team updated successfully.' })
        }
      }
    }

    console.log('❌ No match found — PI not found.')
    return res.status(404).json({ message: 'PI not found.' })
  } catch (err) {
    console.error('🔥 Error saving PI team:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
