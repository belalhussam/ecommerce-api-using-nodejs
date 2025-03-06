const nodemailer = require('nodemailer')
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    })
    // 2) Define email options (like from, to, subject, email content)
    const mailOpts = {
        from: 'E-shop App <belalhsoaam@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    // 3) Send email
    await transporter.sendMail(mailOpts)
}

module.exports = sendEmail
