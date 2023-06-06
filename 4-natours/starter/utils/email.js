const nodemailer = require('nodemailer');

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = `Hislordship Academy <${process.env.EMAIL_FROM}>`;
//   }
//   createTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       // Sendgrid
//       return nodemailer.createTransport({
//         service: 'SendGrid',
//         auth: {
//           user: process.env.SENDGRID_USERNAME,
//           pass: process.env.SENDGRID_PASSWORD,
//         },
//       });
//     }

//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }
//   send(template, subject) {
//     // 1) Render HTML based on a pug template
//     const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`);
//     // 2) Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: template,
//     };
//     // 3) Create a transport and send email
//   }
//   sendWelcome() {
//     this.send('welcome', 'Welcome to the Natours Family!');
//   }
// };
const sendEmail = async (options) => {
  // create a transporter with nodemailer
  const transporter = nodemailer.createTransport({
    name: 'hello',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // create email options
  const mailOptions = {
    from: `Hislordship Academy <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
