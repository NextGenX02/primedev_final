const prismaInit = require('../database/index')
/* Initialize prisma client first */
const prismaClient = prismaInit()
console.log("Prisma client has been initialized")

function prismaMiddleware(req,res,next) {
    req.pdb = prismaClient // Register Prisma client as pdb property
    next()
}

module.exports = prismaMiddleware