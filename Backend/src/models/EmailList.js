const mongoose = require('mongoose')

const EmailEntrySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
)

// New sub-schema for each PI entry
const PISubSchema = new mongoose.Schema(
  {
    email: [EmailEntrySchema],
    'Co-PI': [EmailEntrySchema],
    'Team-members': [EmailEntrySchema],
  },
  { _id: false }
)

const EmailListSchema = new mongoose.Schema(
  {
    // List of Grant Admins emails as objects
    grantAdmins: [EmailEntrySchema],

    // Each division → array of email objects
    grantManagers: {
      type: Map,
      of: [EmailEntrySchema],
      default: {},
    },

    // PIs is now a nested Map:
    // - Key (first level): division name.
    // - Value (second level): a Map where key is the PI name and value is a subdocument following PISubSchema.
    PIs: {
      type: Map,
      of: {
        type: Map,
        of: PISubSchema,
        default: {},
      },
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
