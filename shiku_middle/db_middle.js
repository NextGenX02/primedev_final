const prismaInit = require('../database/index')
/* Initialize prisma client first */
const prismaClient = prismaInit()
console.log("Prisma client has been initialized")
prismaClient.$connect().then(() => console.log("Connected to Database!")).catch((error) => {
    console.error(`Error Connecting to Database ${error}`)
    throw Error(`Error Connecting to Database ${error}`)
})

function prismaMiddleware(req, res, next) {
    req.pdb = prismaClient // Register Prisma client as pdb property
    next()
}

module.exports = prismaMiddleware