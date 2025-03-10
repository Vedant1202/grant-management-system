const express = require('express')
const {
  createGrant,
  getAllGrants,
  getGrantById,
  updateGrant,
  deleteGrant,
  updateGrantStatus,
} = require('../controllers/grantController')

const router = express.Router()

// Grant proposal CRUD operations
router.post('/', createGrant) // Create a new grant
router.get('/', getAllGrants) // Get all grants
router.get('/:id', getGrantById) // Get a specific grant
router.put('/:id', updateGrant) // Update a grant
router.delete('/:id', deleteGrant) // Delete a grant
router.patch('/:id/status', updateGrantStatus) // Update grant status (Accept/Reject)

module.exports = router
