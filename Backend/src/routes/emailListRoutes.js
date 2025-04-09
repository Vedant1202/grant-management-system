const express = require('express')
const router = express.Router()
const emailListController = require('../controllers/emailListController')

router.get('/', emailListController.getEmailLists)
router.put('/', emailListController.saveEmailLists)
router.get('/pi-team', emailListController.getPITeam)
router.put('/pi-team', emailListController.savePITeam)

module.exports = router
