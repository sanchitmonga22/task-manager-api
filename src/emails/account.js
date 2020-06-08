const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "sanchitmonga22@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "sanchitmonga22@gmail.com",
    subject: "We are sorry to here that you will be parting us",
    text: `Goodbye, ${name}, We hope to see you back soon`,
  });
};

// sgMail.send({
//   to: "sanchitmonga22@gmail.com",
//   from: "sanchitmonga22@gmail.com",
//   subject: "Sending with Twilio SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// });

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
