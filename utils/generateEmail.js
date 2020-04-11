const nodemailer = require("nodemailer");
const { GMAIL_ID, APP_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  debug: true,
  auth: {
    user: GMAIL_ID,
    pass: APP_PASSWORD
  }
});

const sendMailToUser = async (email, token, mode) => {
  try {
    let html = mode === "email" ? `
    <h1>Welcome to my application</h1>
    <p>Thanks for creating an account. Click 
      <a href=http://localhost:8089/confirmEmail/${token}>here</a> to confirm your account. Or copy paste http://localhost:8089/confirmEmail/${token} to your browser.
    </p> 
  ` : `
  <h1>Rest Password</h1>
  <p>Thanks for creating an account. Here is your otp to change the password ${token} </p>
`
    await transport.sendMail({
      from: GMAIL_ID,
      to: email,
      subject: "Confirm your email",
      html: html
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = sendMailToUser;
