module.exports = {
  CLINICAL_TRIALS_CONSULTATION: {
    subject: "Consultation Request for Clinical Trials/Human Subjects",
    text: (data) =>
      `Dr. ${data.piLastName} in the "${data.piDivision}" division has submitted a request for consultation for the Clinical Trials/Human Subjects section in ASSIST. Please assist.`,
    html: (data) =>
      `<h3>Consultation Request for Clinical Trials/Human Subjects</h3>
       <p>Dr. <b>${data.piLastName}</b> in the "<b>${data.piDivision}</b>" division has submitted a request for consultation for the Clinical Trials/Human Subjects section in ASSIST.</p>
       <p>Please assist.</p>`,
  },

  DOM_CTU_CONSULTATION: {
    subject: "Consultation Request with DOM CTU",
    text: (data) =>
      `Dr. ${data.piLastName} in the "${data.piDivision}" division has submitted a request for consultation with the DOM CTU. Please assist.`,
    html: (data) =>
      `<h3>Consultation Request with DOM CTU</h3>
       <p>Dr. <b>${data.piLastName}</b> in the "<b>${data.piDivision}</b>" division has submitted a request for consultation with the DOM Clinical Trials Unit.</p>
       <p>Please assist.</p>`,
  },

  INTAKE_FORM_SUBMITTED: {
    subject: "Intake Form Submitted - Action Required",
    text: (data) =>
      `Dr. ${data.piLastName} in the "${data.piDivision}" division has submitted an Intent to Submit intake form. Please contact the PI to schedule a one-on-one meeting.`,
    html: (data) =>
      `<h3>Intake Form Submitted - Action Required</h3>
       <p>Dr. <b>${data.piLastName}</b> in the "<b>${data.piDivision}</b>" division has submitted an Intent to Submit intake form.</p>
       <p>Please contact the PI to schedule a one-on-one meeting.</p>`,
  },

  INTAKE_FORM_CONFIRMATION: {
    subject: "Intent to Submit Intake Form Confirmation",
    text: () =>
      `Thank you for completing the Intent to Submit intake form. An assigned grant manager will be in contact for further steps shortly.`,
    html: () =>
      `<h3>Intent to Submit Intake Form Confirmation</h3>
       <p>Thank you for completing the Intent to Submit intake form.</p>
       <p>An assigned grant manager will be in contact for further steps shortly.</p>`,
  },

  INTAKE_FORM_ACCEPTED: {
    subject: "Intake Form Accepted - Next Steps",
    text: (data) =>
      `Dear Dr. ${data.piLastName}, your intake form has been reviewed and accepted by a grant manager. They will be reaching out to schedule a one-on-one meeting.`,
    html: (data) =>
      `<h3>Intake Form Accepted - Next Steps</h3>
       <p>Dear Dr. <b>${data.piLastName}</b>,</p>
       <p>Your intake form has been reviewed and accepted by a grant manager.</p>
       <p>They will be reaching out to schedule a one-on-one meeting.</p>`,
  },

  INTAKE_FORM_MODIFICATION: {
    subject: "Intake Form Requires Modification",
    text: (data) =>
      `Dear Dr. ${data.piLastName}, your intake form requires modification. Additional information requested: "${data.additionalInfo}". Please update your submission accordingly.`,
    html: (data) =>
      `<h3>Intake Form Requires Modification</h3>
       <p>Dear Dr. <b>${data.piLastName}</b>,</p>
       <p>Your intake form requires modification. Additional information requested:</p>
       <blockquote>${data.additionalInfo}</blockquote>
       <p>Please update your submission accordingly.</p>`,
  },

  FINAL_REVIEW_REMINDER: {
    subject: "Action Required - Final Review Deadline Approaching",
    text: (data) =>
      `Dear Dr. ${data.piLastName}, please work on the task list as the FINAL ASSIST application is due to OSP in 5 business days.`,
    html: (data) =>
      `<h3>Action Required - Final Review Deadline Approaching</h3>
       <p>Dear Dr. <b>${data.piLastName}</b>,</p>
       <p>Please work on the task list as the FINAL ASSIST application is due to OSP in <b>5 business days</b>.</p>
       <p>Let us know if you need any assistance.</p>`,
  },
};
