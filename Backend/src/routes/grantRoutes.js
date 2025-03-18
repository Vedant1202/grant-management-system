const express = require('express')
const {
  createGrant,
  getAllGrants,
  getGrantById,
  updateGrant,
  deleteGrant,
  updateGrantStatus,
  getPendingGrants,
  updateAdditionalData, // ✅ New Controller Function
  getAdditionalData, // ✅ New Controller Function
} = require('../controllers/grantController')

const router = express.Router()

// Grant proposal CRUD operations
router.post('/', createGrant) // Create a new grant
router.get('/', getAllGrants) // Get all grants
router.get('/pending', getPendingGrants) // New route for fetching only pending proposals
router.get('/:id', getGrantById) // Get a specific grant
router.put('/:id', updateGrant) // Update a grant
router.delete('/:id', deleteGrant) // Delete a grant
router.patch('/:id/status', updateGrantStatus) // Update grant status (Accept/Reject)

// ✅ New Routes for additionalData
router.patch('/:id/additionalData', updateAdditionalData) // Save timeline & template
router.get('/:id/additionalData', getAdditionalData) // Fetch timeline & template

module.exports = router
