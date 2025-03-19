const mongoose = require('mongoose')

const EmailEntrySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
)

const EmailListSchema = new mongoose.Schema(
  {
    grantAdmins: [EmailEntrySchema], // List of Grant Admins emails as objects

    grantManagers: {
      type: Map,
      of: [EmailEntrySchema], // Each division → array of email objects
      default: {},
    },

    PIs: {
      type: Map,
      of: new mongoose.Schema(
        {
          emails: [EmailEntrySchema], // PIs per division → list of email objects
        },
        { _id: false }
      ),
      default: {},
    },

    teamMembers: {
      type: Map,
      of: new mongoose.Schema(
        {
          emails: [EmailEntrySchema], // Team Members per PI → list of email objects
        },
        { _id: false }
      ),
      default: {},
    },

    additionalData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (v) {
          return typeof v === 'object' && v !== null
        },
        message: 'additionalData must be an object.',
      },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('EmailList', EmailListSchema)
