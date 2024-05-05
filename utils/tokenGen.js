const crypto = require("crypto")
function generateVerifyToken() {
    return crypto.randomBytes(32/ 2).toString("hex");
}
module.exports = generateVerifyToken