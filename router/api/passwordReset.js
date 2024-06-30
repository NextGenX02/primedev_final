const {createBlowFishHash} = require("../../utils/passwordHash")
const {Router} = require("express")

const router = new Router()

router.post("/reset-acc/:resetToken", async function (req, res) {
    const rstToken = req.params?.resetToken
    const password = req.body?.password

    // Get the token from the database and see if the token exists
    const rTokenDb = await req.pdb.users.findFirst({
        where: {
            resetToken: rstToken
        }, select: {
            resetToken: true,
            id: true
        }
    })
    if (!rTokenDb) {
        return res.status(400).json({Status: "failed", Message: "Invalid reset Token"})
    }
    // Update the old password with the new one
    const passwordHash = await createBlowFishHash(password)
    await req.pdb.users.update({
        where: {id: rTokenDb?.id},
        data: {
            password: passwordHash,
            resetToken: ""
        }
    })
    return res.status(200).send({Status: "Success", Message: "Successfully change the old password!"})
})

module.exports = router