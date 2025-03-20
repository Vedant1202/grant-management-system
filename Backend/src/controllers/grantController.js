const Grant = require("../models/Grant");
const { sendEmailByTemplate } = require("../services/emailService");
const EmailList = require("../models/EmailList");

exports.createGrant = async (req, res) => {
  try {
    const newGrant = new Grant(req.body);
    await newGrant.save();

    // Extract necessary details for email
    const {
      piFirstName,
      piLastName,
      piEmail,
      piDivision,
      projectTitle,
      consultClinicalTrials,
      consultDOMCTU
    } = req.body;

    // 🚀 Fetch recipients from EmailList
    const emailList = await EmailList.findOne();
    let recipients = [];

    // Grant Admins receive all submissions
    if (emailList?.grantAdmins) {
      recipients = recipients.concat(emailList.grantAdmins.map((admin) => admin.email));
    }

    // Grant Managers of the same division should also receive the notification
    if (emailList?.grantManagers?.[piDivision]) {
      recipients = recipients.concat(emailList.grantManagers[piDivision].map((mgr) => mgr.email));
    }

    // Remove duplicates
    recipients = [...new Set(recipients)];

    // 🚀 Send email notification to grant managers and admins
    if (recipients.length > 0) {
      await sendEmailByTemplate("INTAKE_FORM_SUBMITTED", {
        piName: `${piFirstName} ${piLastName}`,
        piLastName,
        piEmail,
        projectTitle,
        piDivision,
      }, recipients);
    }

    // 🚀 Send confirmation email to the PI
    await sendEmailByTemplate("INTAKE_FORM_CONFIRMATION", {}, [piEmail]);

    // 🚀 Send Clinical Trials Consultation request if applicable
    if (consultClinicalTrials === "yes") {
      const clinicalTrialRecipients = ["veyyspam2@gmail.com", "cheryl@example.com"]; // Update actual emails
      await sendEmailByTemplate("CLINICAL_TRIALS_CONSULTATION", {
        piLastName,
        piDivision,
      }, clinicalTrialRecipients);
    }

    // 🚀 Send DOM CTU Consultation request if applicable
    if (consultDOMCTU === "yes") {
      const domCTURecipients = ["dom-ctu-support@example.com"]; // Update actual email
      await sendEmailByTemplate("DOM_CTU_CONSULTATION", {
        piLastName,
        piDivision,
      }, domCTURecipients);
    }

    res.status(201).json({ message: "Grant proposal created successfully", grant: newGrant });

  } catch (err) {
    console.error("❌ Error creating grant proposal:", err);
    res.status(500).json({ error: err.message });
  }
};



// Get all grant proposals
exports.getAllGrants = async (req, res) => {
  try {
    const { piEmail } = req.query
    const query = piEmail ? { piEmail } : {} // Filter by user email if provided
    const grants = await Grant.find(query)
    res.status(200).json(grants)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getPendingGrants = async (req, res) => {
  try {
    const pendingGrants = await Grant.find({ status: 'pending' })
    res.status(200).json(pendingGrants)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get a specific grant proposal by ID
exports.getGrantById = async (req, res) => {
  try {
    const grant = await Grant.findById(req.params.id)
    if (!grant) return res.status(404).json({ message: 'Grant proposal not found' })
    res.status(200).json(grant)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update a grant proposal
exports.updateGrant = async (req, res) => {
  try {
    const updatedGrant = await Grant.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedGrant) return res.status(404).json({ message: 'Grant proposal not found' })
    res.status(200).json({ message: 'Grant updated successfully', grant: updatedGrant })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updateAdditionalData = async (req, res) => {
  try {
    const { id } = req.params
    const { timeline, tasklist, selectedTemplateTimeline, selectedTemplateTaskList, ackPi } = req.body

    // Create an object to hold only the fields that are present in the request
    let updateFields = {}

    if (timeline !== undefined) updateFields['additionalData.timeline'] = timeline
    if (tasklist !== undefined) updateFields['additionalData.tasklist'] = tasklist
    if (selectedTemplateTimeline !== undefined)
      updateFields['additionalData.selectedTemplateTimeline'] = selectedTemplateTimeline
    if (selectedTemplateTaskList !== undefined)
      updateFields['additionalData.selectedTemplateTaskList'] = selectedTemplateTaskList
    if (ackPi !== undefined) updateFields['additionalData.ackPi'] = ackPi // ✅ Include ackPi

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' })
    }

    const updatedGrant = await Grant.findByIdAndUpdate(
      id,
      { $set: updateFields }, // ✅ Update only the fields provided
      { new: true }
    )

    if (!updatedGrant) return res.status(404).json({ message: 'Grant proposal not found' })

    res.status(200).json({ message: 'Additional data updated successfully', grant: updatedGrant })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getAdditionalData = async (req, res) => {
  try {
    const { id } = req.params

    const grant = await Grant.findById(id, 'additionalData') // Fetch only additionalData field
    if (!grant) return res.status(404).json({ message: 'Grant proposal not found' })

    res.status(200).json(grant.additionalData || {}) // Return empty object if additionalData is undefined
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete a grant proposal
exports.deleteGrant = async (req, res) => {
  try {
    const deletedGrant = await Grant.findByIdAndDelete(req.params.id)
    if (!deletedGrant) return res.status(404).json({ message: 'Grant proposal not found' })
    res.status(200).json({ message: 'Grant deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update grant status (Accept/Reject/Needs Modification)
exports.updateGrantStatus = async (req, res) => {
  try {
    const { status, rejectionNote } = req.body;

    if (!['pending', 'accepted', 'needs modification', 'accepted - pending meeting with GM'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const grant = await Grant.findByIdAndUpdate(
      req.params.id,
      { status, rejectionNote },
      { new: true }
    );

    if (!grant) return res.status(404).json({ message: 'Grant proposal not found' });

    // 🚀 Prepare email notification
    const { piFirstName, piLastName, piEmail, piDivision, projectTitle } = grant;
    const emailData = {
      piLastName,
      piEmail,
      piDivision,
      projectTitle,
      additionalInfo: rejectionNote, // Use rejectionNote as additional info if modification is needed
    };

    if (status === 'accepted') {
      await sendEmailByTemplate('INTAKE_FORM_ACCEPTED', emailData, [piEmail]);
    } else if (status === 'needs modification') {
      await sendEmailByTemplate('INTAKE_FORM_MODIFICATION', emailData, [piEmail]);
    }

    res.status(200).json({ message: `Grant ${status}`, grant });
  } catch (err) {
    console.error("❌ Error updating grant status:", err);
    res.status(500).json({ error: err.message });
  }
};
