const mailer = require("nodemailer")
const Dparser = new DOMParser()

const transporter = mailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: process.env.SMTP_SECURE_MODE.toLowerCase() === "true",
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
})

async function sendEmail(htmlStringOrData, destinationEmail, senderName, subject) {
    const emailID = await transporter.sendMail({
        from: `${senderName} <${process.env.SMTP_EMAIL_ADDRESS}>`,
        to: destinationEmail,
        subject,
        //TODO: MAKE a conditional if the data is a HTML or not
    })
}

function isAHtmlData(data) {
    try {
        Dparser.parseFromString(data, "text/html")
        return true
    } catch {
        return false
    }
}