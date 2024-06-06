const {compareBlowFishHash} = require("../../utils/passwordHash")
const {genJWTToken} = require("../../utils/jwt")
const validator = require("validator")

module.exports = {
    NAME: "login",
    METHOD: "post",
    disable: false,
    execute: async function (req, res) {
        if (!req.body?.email || !req.body?.password) {
            return res.status(400).json({Status: "Client Error", Message: "email or password is required!"})
        }
        const email = req.body?.email
        const password = req.body?.password
        if (!validator?.isEmail(email)) {
            return res.status(400).json({Status: "Client Error", Message: "Email is not valid!"})
        }
        // Get the password hash base the user input email
        const userData = await req.pdb.users.findUnique({
            where: {
                email
            }
        })

        if (!userData) {
            return res.status(200).json({Status:"Ok with Error",Message:"email is incorrect, or that account is not exist!"})
        }
        // Make sure the account is Active!
        if (!userData?.verify) {
            return res.status(200).json({Status:"Ok with Error",Message:"That account is not active!"})
        }
        // Check if the password is correct
        const isCorrectPassword = await compareBlowFishHash(password,userData.password)
        if (!isCorrectPassword) {
            return res.status(400).json({Status: "Client Error", Message: "Password is incorrect!"})
        }
        // Generate a new Token for the client
        const token = genJWTToken({userId: userData.id, role:userData.role, username:userData.username}, "1h")
        // Set the token into cookies!
        res.cookie("auth", token, {httpOnly:true,signed:true,maxAge:60000})
        return res.status(200).json({Status:"OK"})
    }
}