// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 01. Create a transporter

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 02. Define email options.
  const mailOptions = {
    from: 'Mohamed Adam <hello@tes.io>',
    to: options.email,
    subject: options.subject,
    text: 'Plaintext version of the message',
    html: `<p>${options.message}</p>`,
  };

  // 03. Send the actual email with nodemailr
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
