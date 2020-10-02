const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (address, subject, message) => {
  var transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  let info = await transport.sendMail({
    from: process.env.MAIL_FROM,
    to: address,
    subject: subject,
    text: message,
  });
};

module.exports = sendEmail;
