const crypto = require("crypto")
const tokenGen = require('../../utils/tokenGen')

module.exports = {
    NAME: "register",
    METHOD: "post",
    disable: false,
    execute: async function (req,res) {
        const hash256 = crypto.createHash("sha256")
        const username = req.body?.username
        const email = req.body?.email
        const passwordHash = hash256.update(req.body.password).digest("hex");

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
                    verifyToken: tokenGen()
                }
            })
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