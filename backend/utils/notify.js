// backend/utils/notify.js
const Notification = require('../models/Notification');

let nodemailer;
let transporter = null;
try {
  nodemailer = require('nodemailer');
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
} catch (e) {
  console.warn('nodemailer not installed or failed to load:', e.message);
}

async function notifyUser(userId, title, body, email) {
  try {
    await Notification.create({ user: userId, title, body, read: false });
    if (transporter && email) {
      try {
        await transporter.sendMail({ from: process.env.SMTP_USER, to: email, subject: title, text: body });
      } catch (mailErr) {
        console.warn('Failed to send notification email:', mailErr.message);
      }
    }
  } catch (err) {
    console.error('notifyUser error:', err && err.message ? err.message : err);
  }
}

module.exports = notifyUser;
