const express = require("express");
const router = express.Router();
const emailListController = require("../controllers/emailListController");

router.get("/", emailListController.getEmailLists);
router.put("/", emailListController.saveEmailLists);

module.exports = router;
