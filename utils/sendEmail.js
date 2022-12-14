const nodeMailer = require("nodemailer")

const sendEmail = async (options) => {
  let transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: "danfeuk121@gmail.com",
      pass: "ybyvksmzjacsdevd"
    }
  });

  const mailOptions = {
    from: "danfeuk121@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message
  }
  await transporter.sendMail(mailOptions);

}
module.exports = sendEmail