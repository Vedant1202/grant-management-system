const mongoose = require("mongoose");

const EmailListSchema = new mongoose.Schema(
  {
    grantAdmins: [{ type: String, required: true }], // List of Grant Admins emails
    grantManagers: {
      type: Map,
      of: [String], // Each division has an array of emails
      default: {},
    },
    PIs: {
      type: Map,
      of: {
        type: Map,
        of: [String], // Each division → PI → list of emails
      },
      default: {},
    },
    teamMembers: {
      type: Map,
      of: {
        type: Map,
        of: [String], // Each division → PI → team members' emails
      },
      default: {},
    },
    additionalData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (v) {
          return typeof v === "object" && v !== null;
        },
        message: "additionalData must be an object.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailList", EmailListSchema);
