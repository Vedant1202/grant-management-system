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
    const grants = await Grant.find()
    res.status(200).json(grants)
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

    if (!['accepted', 'rejected', 'pending'].includes(status)) {
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
