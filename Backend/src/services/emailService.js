const nodemailer = require("nodemailer");
const templates = require("../emailTemplates/templates");


/**
 * Fetch recipients from EmailList based on role
 * @param {string} role - Role name (e.g., 'grantAdmins', 'PIs')
 * @returns {Promise<Array>}
 */
const getRecipientsByRole = async (role, division = null) => {
  try {
    const emailList = await EmailList.findOne();
    if (!emailList || !emailList[role]) return [];

    if (division) {
      return (emailList[role][division] || []).map((entry) => entry.email);
    }

    return emailList[role].map((entry) => entry.email);
  } catch (error) {
    console.error("❌ Error fetching recipients:", error);
    return [];
  }
};


const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log('email user -', process.env.EMAIL_USER);

/**
 * Send an email using a predefined template
 * @param {string} templateKey - Template name from `templates.js`
 * @param {object} data - Data to populate the template
 * @param {Array} recipients - List of recipient emails
 */
const sendEmailByTemplate = async (templateKey, data, recipients) => {
  if (!templates[templateKey]) {
    console.error(`❌ Template '${templateKey}' not found!`);
    return;
  }

  if (!recipients || recipients.length === 0) {
    console.warn(`⚠️ No recipients provided for template '${templateKey}'`);
    return;
  }

  const mailOptions = {
    from: `"Grant Management" <${process.env.EMAIL_USER}>`,
    to: recipients.join(", "),
    subject: templates[templateKey].subject,
    text: templates[templateKey].text(data),
    html: templates[templateKey].html(data),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${recipients.join(", ")}: ${info.response}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

module.exports = { sendEmailByTemplate };


module.exports = { sendEmailByTemplate };
