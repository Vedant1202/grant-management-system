// // const transporter = require("./emailService");

// const nodemailer = require("nodemailer");
// require('dotenv').config()

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // console.log

// // const mailOptions = {
// //   from: "your_email@gmail.com",
// //   to: "recipient@example.com",
// //   subject: "Hello from Nodemailer",
// //   text: "This is a test email sent using Nodemailer.",
// // };

// // transporter.sendMail(mailOptions, (error, info) => {
// //   if (error) {
// //     console.error("Error sending email: ", error);
// //   } else {
// //     console.log("Email sent: ", info.response);
// //   }
// // });

// console.log(process.env.EMAIL_USER)

// // async function testEmail() {
// //   try {
// //     let info = await transporter.sendMail({
// //       from: process.env.EMAIL_USER,
// //       to: "test-recipient@example.com",
// //       subject: "Test Email",
// //       text: "This is a test email from my Node.js app.",
// //     });

// //     console.log("✅ Email sent successfully!", info);
// //   } catch (error) {
// //     console.error("❌ Failed to send email:", error);
// //   }
// // }

// // testEmail();
