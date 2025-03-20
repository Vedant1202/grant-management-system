const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()
const connectDB = require('./config/db')
const session = require('express-session')
const passport = require('passport')

const authRoutes = require('./routes/authRoutes')
const grantRoutes = require('./routes/grantRoutes')
const emailListRoutes = require('./routes/emailListRoutes') // Import email list routes
require('./config/passport') // Import passport configuration
const emailRoutes = require("./routes/emailRoutes");
const sendFinalReviewReminders = require("./jobs/finalReviewReminder");

connectDB() // Connect to MongoDB

const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use('/api/auth', authRoutes)
app.use('/api/grants', grantRoutes)
app.use('/api/email-lists', emailListRoutes) // Integrate email list routes
app.use("/api/email", emailRoutes);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

app.use(passport.initialize())
app.use(passport.session())

// Start the scheduled job
sendFinalReviewReminders();

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
