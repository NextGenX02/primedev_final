const crypto = require("crypto")
const {genJWTToken} = require("../../utils/jwt")

module.exports = {
    NAME: "login",
    METHOD: "post",
    disable: false,
    execute: async function (req, res) {
        const hash256 = crypto.createHash("sha256")
        if (!req.body?.email || !req.body?.password) {
            return res.status(400).json({Status: "Client Error", Message: "email or password is required!"})
        }
        const email = req.body?.email
        const passwordHash = hash256.update(req.body?.password).digest("hex")
        // Get the password and email from the DB
        const userData = await req.pdb.users.findUnique({
            where: {
                email: email, AND: {
                    password: passwordHash
                }
            }
        })
        if (!userData) {
            return res.status(200).json({Status:"Ok with Error",Message:"email or password is incorrect, or that account is not exist!"})
        }
        // Make sure the account is Active!
        if (!userData?.verify) {
            return res.status(200).json({Status:"Ok with Error",Message:"That account is not active!"})
        }
        // Generate a new Token for the client
        const token = genJWTToken({userId: userData.id, role:userData.role, username:userData.username}, "1h")
        // Set the token into cookies!
        res.cookie("auth", token, {httpOnly:true,signed:true,maxAge:60000})
        return res.status(200).json({Status:"OK"})
    }
}