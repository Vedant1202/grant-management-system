const passport = require('passport')
const { Strategy } = require('passport-azure-ad-oauth2')
const User = require('../models/User')
require('dotenv').config()

passport.use(
  new Strategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_REDIRECT_URI,
      tenant: process.env.MICROSOFT_TENANT_ID,
      authorizationURL: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/authorize`,
      tokenURL: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/token`,
    },
    async (accessToken, refreshToken, params, profile, done) => {
      try {
        // Decode ID Token
        const jwt = require('jsonwebtoken')
        const decoded = jwt.decode(params.id_token)

        if (!decoded) return done(null, false)

        // Find or Create User
        let user = await User.findOne({ email: decoded.email })
        if (!user) {
          user = new User({ name: decoded.name, email: decoded.email, role: 'pi' })
          await user.save()
        }

        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    }
  )
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})
