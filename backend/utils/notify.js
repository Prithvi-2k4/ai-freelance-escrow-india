// backend/utils/notify.js
const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}) : null;

async function notifyUser(userId, title, body, email) {
  try {
    // create in-app notification
    await Notification.create({
      user: userId,
      title,
      body,
      read: false
    });

    // optional email
    if (transporter && email) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: title,
        text: body
      });
    }
  } catch (err) {
    console.error('notifyUser error:', err && err.message ? err.message : err);
  }
}

module.exports = notifyUser;
