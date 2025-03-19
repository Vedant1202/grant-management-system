const express = require("express");
const { sendEmail } = require("../services/emailService");

const router = express.Router();

/**
 * @route POST /api/email/send
 * @desc  Send an email
 * @access Public
 */
router.post("/send", async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = await sendEmail(to, subject, text, html);
  res.json(result);
});

module.exports = router;
