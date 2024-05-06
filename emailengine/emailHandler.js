const mailer = require("nodemailer")
const jsdom = require("jsdom")
const DOMParser = require('xmldom').DOMParser;
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
    try {
        const email = await transporter.sendMail({
            from: `${senderName} <${process.env.SMTP_EMAIL_ADDRESS}>`,
            to: destinationEmail,
            subject,
            //TODO: MAKE a conditional if the data is a HTML or not
            text: isAHtmlData(htmlStringOrData) ? null : htmlStringOrData,
            html: isAHtmlData(htmlStringOrData) ? htmlStringOrData : null
        })
        return {message:`Successfully send message with id ${email.messageId}`, error:null}
    } catch (sendError) {
        return {message:null,error:`Error while try to send an email!\n ${sendError}`}
    }
}

function isAHtmlData(data) {
    try {
        Dparser.parseFromString(data, "text/html")
        return true
    } catch {
        return false
    }
}

module.exports.sendEmail = sendEmail