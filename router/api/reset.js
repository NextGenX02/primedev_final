const validator = require("validator")
const fs = require("fs")
const path = require("path")
const Mustache = require("mustache")
const tokenGen = require("../../utils/tokenGen");
const {sendEmail} = require("../../emailengine/emailHandler");
const {Router} = require("express")

const router = new Router()

router.post("/reset-rp", async function (req, res) {
    const requestEmail = req.body?.email
    if (!requestEmail) {
        return res.status(400).json({Status: "failed", Message: "Email is required"})
    }
    if (!validator.isEmail(requestEmail)) {
        return res.status(400).json({Status: "failed", Message: "Please enter a valid email"})
    }
    // find the requested email if find generate a reset token
    const userData = await req.pdb.users.findUnique({
        where: {
            email: requestEmail
        },
        select: {
            email: true,
            username: true
        }
    })
    if (!userData) {
        return res.status(404).json({Status: "Not Found", Message: "Email is not registered"})
    }
    // generate a unique token for reset and save it in the database
    const resetToken = tokenGen()
    try {
        await req.pdb.users.update({
            where:
                {
                    email: requestEmail
                },
            data: {
                resetToken
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({Status: "Server Error", Message: "Server Error detected!, Please try again Later"})
    }

    // Send reset email
    const resetEmailTemplate = fs.readFileSync(path.join(__dirname, "..", "..", "emailTemplate", "reset_account.html")).toString()
    const rEmailInject = Mustache.render(resetEmailTemplate, {
        username: userData?.username,
        verify_link: process.env.RUN_IN_SSL_MODE === "true" ? `https://${process.env.HTTP_HOSTNAME}:${process.env.HTTPS_LISTEN_PORT}/api/reset-acc/${resetToken}` : `http://${process.env.HTTP_HOSTNAME}:${process.env.HTTP_LISTEN_PORT}/api/reset-acc/${resetToken}`
    })
    const sendResult = await sendEmail(rEmailInject, requestEmail, "[SYSTEM] NGX Music Streaming", "Lost your password?")
    if (sendResult.error) {
        console.error(sendResult.error)
        return res.status(500).json({Status: "Server Error", Message: "Server Error detected!, Please try again Later"})
    }
    return res.status(200).json({
        Status: "Ok",
        Message: "Confirmation email has been sent!,Please check your inbox/spam"
    })
})

module.exports = router