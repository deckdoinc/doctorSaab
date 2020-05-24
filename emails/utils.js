"use strict";
const nodemailer = require('nodemailer');

const DEFAULT_SENDER = 'DoctorSaab - Thank you for your quote request <adiita2010@gmail.com>'
const mailerConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'adiita2010@gmail.com',
        pass: 'cgpyvzshtldwmhsl'
    }
}

// this is async (returns a Promise - non blocking)
const sendCustomEmail = async(subject, receiverEmail, messageBody) => {
  // reusable transporter
  let transporter = nodemailer.createTransport(mailerConfig);
  // send mail
  let messageInfo = await transporter.sendMail({
    from: DEFAULT_SENDER,
    to: `${receiverEmail}, adiita2010+doctrsaab@gmail.com`,
    subject: subject,
    html: messageBody
  });

  console.log("Message sent: %s", messageInfo.messageId);
}

module.exports = { sendCustomEmail }