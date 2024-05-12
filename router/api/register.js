const {createBlowFishHash} = require("../../utils/passwordHash")
const tokenGen = require('../../utils/tokenGen')
const Mustache = require("mustache")
const fs = require("fs")
const path = require("path")
const {sendEmail} = require('../../emailengine/emailHandler')

module.exports = {
    NAME: "register",
    METHOD: "post",
    disable: false,
    execute: async function (req,res) {
        const username = req.body?.username
        const email = req.body?.email
        const passwordHash = await createBlowFishHash(req.body?.password)
        const vToken = tokenGen()

        /* TODO: Add some recaptha to filter if is the real user or not */
        /* TODO: maybe not for now :P */
        // Save new data to database
        try {
            await req.pdb.users.create({
                data: {
                    username,
                    email,
                    role:"USER",
                    password: passwordHash,
                    verifyToken: vToken
                }
            })
            // Load the email template
            const verifyEmailTemplate = fs.readFileSync(path.join(__dirname, "..", "..", "emailTemplate","verify_account.html")).toString()
            const injectedHtml = Mustache.render(verifyEmailTemplate, {username, verify_link:process.env.RUN_IN_SSL_MODE === "true" ? `https://${process.env.HTTP_HOSTNAME}:${process.env.HTTPS_LISTEN_PORT}/api/verify/${vToken}` : `http://${process.env.HTTP_HOSTNAME}:${process.env.HTTP_LISTEN_PORT}/api/verify/${vToken}`})
            // send the email
            const sendResult = await sendEmail(injectedHtml,email,"[SYSTEM] NGX Music Streaming","Verify your email to continue!")
            if (sendResult.error) {
                console.error(sendResult.error)
                return res.status(500).json({Status:"Server Error"})
            }
            return res.status(200).json({Status:"OK",Messages:"Account has been created successfully!\nPlease check your email to confirm your account"})
        } catch (saveError) {
            console.error(`Error when saving user data into database!\n${saveError}`)
            if (saveError.toString().includes("Unique")) {
                return res.status(400).json({Status:"Client Error",Messages:"That username or email is already exist!,Please try different username or email."})
            }
            return res.status(500).json({Status:"Server Error!",Messages:"an server error has occurred!,Please try again later."})
        }
    }
}