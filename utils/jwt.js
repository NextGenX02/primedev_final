const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")

function signJWT(payloadData, expires) {
    const jwtPKey = fs.readFileSync(path.join(__dirname, "..", "ssl","jwt_private.key"))
    return jwt.sign(
        {
            data: payloadData,
        }
        , jwtPKey, {algorithm: "RS256", expiresIn:expires, issuer:"NGX_TOKEN_GENERATOR"})
}

function verifyAndUnpackJWT(token) {
    const jwtPubKey = fs.readFileSync(path.join(__dirname,"..","ssl","jwt_public.key"))
    try {
        const tokenData = jwt.verify(token, jwtPubKey)
        return tokenData?.data
    } catch (verifyError) {
        if (verifyError.message === "jwt expired") {
            throw new Error("Token is expired!")
        }
        if (verifyError.message === "invalid token") {
            throw new Error("Invalid Token!")
        }
        throw new Error(`Error when verify the token! ${verifyError}`)
    }
}

module.exports.genJWTToken = signJWT
module.exports.verifyAndUnpack = verifyAndUnpackJWT