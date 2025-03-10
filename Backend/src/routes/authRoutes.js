const express = require('express')
const passport = require('passport')
const router = express.Router()

// Microsoft SSO Login
router.get('/microsoft', passport.authenticate('azure_ad_oauth2'))

// Callback after successful login
router.get(
  '/microsoft/callback',
  passport.authenticate('azure_ad_oauth2', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
  }
)

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL)
  })
})

module.exports = router
