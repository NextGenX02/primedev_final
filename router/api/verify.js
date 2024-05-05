module.exports = {
    NAME: "verify:verToken",
    METHOD: "GET",
    disable: false,
    execute: async function (req,res) {
        const token = req.params.verToken;
        // Get Verify token from DB
        try {
            const users = await req.pdb.users.findFirst({
                select: {
                    verifyToken: true,
                    id: true
                },
                where: {
                    verifyToken: token
                }
            })
            // Throw Invalid Verify token if the client token is not exist in the database
            if (!users) {
                return res.status(400).json({Status:"Client Error",Messages:"Invalid Verify Token!"})
            }
            // If the verify token from the database is match what the client send
            // then activate the account and delete the verify token
            await req.pdb.users.update({
                where:{
                    id: users?.id
                },
                data: {
                    verify: true,
                    verifyToken:""
                }
            })
            return res.status(200).json({Status:"ok", Messages:"Your account has been activated!,Please re-login"})
        } catch (getError) {
            console.error(getError)
            return res.status(500).json({Status:"Internal Server Error"})
        }
    }
}