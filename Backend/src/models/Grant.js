const mongoose = require('mongoose')

const GrantSchema = new mongoose.Schema(
  {
    piFirstName: { type: String, required: true },
    piLastName: { type: String, required: true },
    piEmail: { type: String, required: true },
    piDivision: { type: String, required: true },

    sponsorDeadlineDate: { type: Date, required: true },
    sponsorDeadlineTime: { type: String, required: true },

    proposalType: { type: String, required: true },
    fundingAgency: { type: String, required: true },

    isSubaward: { type: String, enum: ['yes', 'no'], required: true },
    primeInstitution: { type: String, default: '' },
    primeInstitutionContact: { type: String, default: '' },
    primeInstitutionContactEmail: { type: String, default: '' },

    submissionBy: { type: String, required: true },
    submissionType: { type: String, required: true },
    fundingOpportunity: { type: String, required: true },

    temporaryAppId: { type: String, required: true },

    activityType: { type: String, required: true },
    isClinicalTrial: { type: String, default: '' },
    consultClinicalTrials: { type: String, default: '' },
    consultDOMCTU: { type: String, default: '' },

    projectStartDate: { type: String, required: true },
    projectEndDate: { type: String, required: true },
    projectTitle: { type: String, required: true },

    keyPersonnel: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        institution: { type: String, required: true },
      },
    ],

    hasSubcontracts: { type: String, enum: ['yes', 'no'], required: true },
    subcontracts: [
      {
        subcontractInstitution: { type: String, required: true },
        subcontractSitePI: { type: String, required: true },
        subcontractContactName: { type: String, required: true },
        subcontractContactEmail: { type: String, required: true },
      },
    ],

    additionalRequirements: [{ type: String }],

    hasConflictOfInterest: { type: String, enum: ['yes', 'no', 'unsure'], required: true },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'needs modification', 'accepted - pending meeting with GM'],
      default: 'pending',
    },
    completionStatus: {
      type: String,
      enum: ['not started', 'in progress', 'completed'],
      default: 'in progress',
    },
    rejectionNote: { type: String, default: '' },

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

module.exports = mongoose.model('Grant', GrantSchema)
