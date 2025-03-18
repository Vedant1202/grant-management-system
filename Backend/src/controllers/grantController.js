const Grant = require('../models/Grant')

// Create a new grant proposal
exports.createGrant = async (req, res) => {
  try {
    const newGrant = new Grant(req.body)
    await newGrant.save()
    res.status(201).json({ message: 'Grant proposal created successfully', grant: newGrant })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get all grant proposals
exports.getAllGrants = async (req, res) => {
  try {
    const { piEmail } = req.query
    const query = piEmail ? { piEmail } : {} // Filter by user email if provided
    const grants = await Grant.find(query)
    res.status(200).json(grants)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getPendingGrants = async (req, res) => {
  try {
    const pendingGrants = await Grant.find({ status: 'pending' })
    res.status(200).json(pendingGrants)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get a specific grant proposal by ID
exports.getGrantById = async (req, res) => {
  try {
    const grant = await Grant.findById(req.params.id)
    if (!grant) return res.status(404).json({ message: 'Grant proposal not found' })
    res.status(200).json(grant)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update a grant proposal
exports.updateGrant = async (req, res) => {
  try {
    const updatedGrant = await Grant.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedGrant) return res.status(404).json({ message: 'Grant proposal not found' })
    res.status(200).json({ message: 'Grant updated successfully', grant: updatedGrant })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updateAdditionalData = async (req, res) => {
  try {
    const { id } = req.params
    const { timeline, tasklist, selectedTemplateTimeline, selectedTemplateTaskList } = req.body

    // Create an empty object to hold only the fields that are present in the request
    let updateFields = {}

    if (timeline !== undefined) updateFields['additionalData.timeline'] = timeline
    if (tasklist !== undefined) updateFields['additionalData.tasklist'] = tasklist
    if (selectedTemplateTimeline !== undefined)
      updateFields['additionalData.selectedTemplateTimeline'] = selectedTemplateTimeline
    if (selectedTemplateTaskList !== undefined)
      updateFields['additionalData.selectedTemplateTaskList'] = selectedTemplateTaskList

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' })
    }

    const updatedGrant = await Grant.findByIdAndUpdate(
      id,
      { $set: updateFields }, // Only update fields present in the request
      { new: true }
    )

    if (!updatedGrant) return res.status(404).json({ message: 'Grant proposal not found' })

    res.status(200).json({ message: 'Additional data updated successfully', grant: updatedGrant })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getAdditionalData = async (req, res) => {
  try {
    const { id } = req.params

    const grant = await Grant.findById(id, 'additionalData') // Fetch only additionalData field
    if (!grant) return res.status(404).json({ message: 'Grant proposal not found' })

    res.status(200).json(grant.additionalData || {}) // Return empty object if additionalData is undefined
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete a grant proposal
exports.deleteGrant = async (req, res) => {
  try {
    const deletedGrant = await Grant.findByIdAndDelete(req.params.id)
    if (!deletedGrant) return res.status(404).json({ message: 'Grant proposal not found' })
    res.status(200).json({ message: 'Grant deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update grant status (Accept/Reject)
exports.updateGrantStatus = async (req, res) => {
  try {
    const { status, rejectionNote } = req.body

    if (
      !['pending', 'accepted', 'needs modification', 'accepted - pending meeting with GM'].includes(
        status
      )
    ) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    const grant = await Grant.findByIdAndUpdate(
      req.params.id,
      { status, rejectionNote },
      { new: true }
    )

    if (!grant) return res.status(404).json({ message: 'Grant proposal not found' })

    res.status(200).json({ message: `Grant ${status}`, grant })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
