// backend/utils/notify.js
const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
}) : null;

async function notifyUser(userId, title, body, email) {
  try {
    await Notification.create({ user: userId, title, body, read: false });
    if (transporter && email) {
      await transporter.sendMail({ from: process.env.SMTP_USER, to: email, subject: title, text: body });
    }
  } catch (e) {
    console.error('notify error', e.message || e);
  }
}

module.exports = notifyUser;
