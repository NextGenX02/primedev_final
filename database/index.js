const {PrismaClient} = require("@prisma/client")

function initPrisma() {
    const prisma = new PrismaClient()
    // prisma.$connect().then(() => console.log("Connected to Database!"))
    /* This is very...,VERYY dirty and nasty trick just to disconnect from db when the server is die */
    const signals = ["SIGINT","SIGTERM","SIGQUIT","SIGKILL"]
    signals.forEach(sig => {
        process.once(sig, async () => {
            console.log("Got a exit signal!")
            await prisma.$disconnect()
        })
    })
    return prisma
}
module.exports = initPrisma