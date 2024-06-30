const express = require("express")
const exHttp = express();
const fs = require("fs")
const path = require("path")
const https = require("https")
const cookieParser = require("cookie-parser")
const prismaMiddle = require("../shiku_middle/db_middle")

function InitHttpServer() {
    // Load any middleware
    exHttp.use(express.json()) // Parse JSON body from client
    exHttp.use(express.urlencoded({extended: true})) // Parse FORM URL ENCODED body from client
    exHttp.use(cookieParser(process.env.COOKIE_SIGN_SECRET)) // Parse the cookie from client and sign it
    exHttp.use(prismaMiddle) // Prisma middleware
    // load the dynamic router first before running the server
    dynamicRouteHandler(exHttp)
    // Check if the config tell the server to run in SSL mode or not
    if (process.env.RUN_IN_SSL_MODE === "true") {
        // read private key and certificate
        const pKey = fs.readFileSync(path.join(__dirname,"..", "ssl", "private.pem"))
        const cert = fs.readFileSync(path.join(__dirname,"..", "ssl", "cert.pem"))

        const httpserver = https.createServer({
            key: pKey,
            cert: cert,
            minVersion: "TLSv1.2",
            maxVersion: "TLSv1.3"
        },exHttp)
        httpserver.listen(process.env.HTTPS_LISTEN_PORT,process.env.HTTP_HOSTNAME, () => {
            console.log(`Http server is running in SSL mode on port ${process.env.HTTPS_LISTEN_PORT}`)
        })
        return
    }
    exHttp.listen(process.env.HTTP_LISTEN_PORT,process.env.HTTP_HOSTNAME, () => {
        console.log(`Http server run at port ${process.env.HTTP_LISTEN_PORT}`)
    })
}

function dynamicRouteHandler(expressApp) {
    try {
        const mainDir = fs.readdirSync(path.join("router"))
        for (let subDir of mainDir) {
            const routeFile = fs.readdirSync(path.join("router", subDir))
            for (let rfile of routeFile) {
                const rrF = require(`../router/${subDir}/${rfile}`);
                expressApp.use(`/${subDir}`, rrF)
            }
        }
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = InitHttpServer