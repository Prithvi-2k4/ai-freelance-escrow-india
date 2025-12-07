const Notification = require('../models/Notification');
// optional: nodemailer import if you want to send emails
// const nodemailer = require('nodemailer');

async function notifyUser(userId, title, body, email) {
  try {
    // create in-app notification
    await Notification.create({ user: userId, title, body, read: false });

    // (optional) send email if you configured transporter
    // if (email) { /* send email via nodemailer */ }

    return true;
  } catch (e) {
    console.warn('notifyUser error', e && e.message ? e.message : e);
    return false;
  }
}

module.exports = notifyUser;
