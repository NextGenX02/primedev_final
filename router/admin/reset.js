const {Router} = require("express")

const router = new Router()
router.delete("/reser", async function (req,res) {
    try {
        await req.pdb.users.deleteMany()
        return res.status(200).send("")
    } catch (error) {
        console.error(error)
        return res.status(500).send("")
    }
})
module.exports = router