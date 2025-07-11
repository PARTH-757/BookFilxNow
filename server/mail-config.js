// server/mail-config.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter for Gmail SMTP
const transporter = nodemailer.createTransport({//It tells nodemailer to use Gmail's SMTP server, authenticate using credentials from .env, and use STARTTLS (secure upgrade over an insecure connection).
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS (not SSL)
  auth: {
    user: process.env.GMAIL_USER, // Your email
    pass: process.env.GMAIL_PASS, // App password
  },
});

//  Verify connection configuration (used at startup)
transporter.verify((error, success) => {
  if (error) {
    console.error(" Mail config error:", error);
  } else {
    console.log(" Mail server ready to send messages");
  }
});

module.exports = transporter;
