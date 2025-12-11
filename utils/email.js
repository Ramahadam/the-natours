// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const { convert } = require('html-to-text');

const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.name = user.name.split(' ')[0];
    this.to = user.email;
    this.url = url;
    this.from = `Mohamed Adam <${process.env.EMAIL_FROM}>`;
  }

  // create transport based on enviroment

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Send real eamil to customer in production using sendgrid
      return 1;
    }

    // Send mailtrap in development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send given template
  async send(template, subject) {
    // Prepare the HTML file using pug

    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.name,
        url: this.url,
        subject,
      },
    );

    // 02. Define email options.
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 03. Send the actual email with nodemailr
    await this.newTransport().sendMail(mailOptions);
  }

  // Send welcome email
  async sendWelcome() {
    await this.send('welcome', 'Weclome to natours family');
  }

  // Send password reset

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (Valid for 10 minutes)',
    );
  }
};
