const EmailList = require("../models/EmailList");

exports.getEmailLists = async (req, res) => {
  try {
    let emailLists = await EmailList.findOne();
    if (!emailLists) {
      emailLists = new EmailList();
      await emailLists.save();
    }
    res.json(emailLists);
  } catch (error) {
    console.error("Error fetching email lists:", error);
    res.status(500).json({ error: "Failed to fetch email lists" });
  }
};

exports.saveEmailLists = async (req, res) => {
  try {
    const { grantAdmins, grantManagers, PIs, teamMembers, additionalData } = req.body;

    let emailLists = await EmailList.findOne();
    if (!emailLists) {
      emailLists = new EmailList();
    }

    emailLists.grantAdmins = grantAdmins;
    emailLists.grantManagers = grantManagers;
    emailLists.PIs = PIs;
    emailLists.teamMembers = teamMembers;
    emailLists.additionalData = additionalData;

    await emailLists.save();
    res.json({ message: "Email lists saved successfully!" });
  } catch (error) {
    console.error("Error saving email lists:", error);
    res.status(500).json({ error: "Failed to save email lists" });
  }
};
