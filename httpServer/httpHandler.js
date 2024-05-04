const express = require("express")
const exHttp = express();
const fs = require("fs")
const path = require("path")
const https = require("https")

function InitHttpServer() {
    // load the dynamic router first before running the server
    dynamicRouteHandler(exHttp)
    // TODO:Convert a string from .env file into an actual boolean value
    if (process.env.RUN_IN_SSL_MODE === "true") {
        // read private key and certificate
        const pKey = fs.readFileSync(path.join(__dirname, "ssl", "private.pem"))
        const cert = fs.readFileSync(path.join(__dirname, "ssl", "cert.pem"))

        const httpserver = https.createServer({
            key: pKey,
            cert: cert,
            minVersion: "TLSv1.2",
            maxVersion: "TLSv1.3"
        },exHttp)
        httpserver.listen(process.env.HTTPS_LISTEN_PORT, () => {
            console.log(`Http server is running in SSL mode on port ${process.env.HTTPS_LISTEN_PORT}`)
        })
        return
    }
    exHttp.listen(process.env.HTTP_LISTEN_PORT, () => {
        console.log(`Http server run at port ${process.env.HTTP_LISTEN_PORT}`)
    })
}

function dynamicRouteHandler(expressApp) {
    try {
        const mainDir = fs.readdirSync(path.join("router"))
        mainDir.forEach(subDir => {
            const routeFiles = fs.readdirSync(path.join("router", subDir))
            routeFiles.forEach(route => {
                const rdata = require(path.join("../","router", subDir, route))
                if (!rdata.disable) {
                    // Dammm.. this is very nasty
                    // expressApp[rdata.METHOD.toLowerCase()]("/", (...params) => rdata.execute(...params))
                    // console.log(rdata?.ROUTEPARAMS ? `/${subDir}/${rdata.NAME ? rdata.NAME : ""}:${rdata.ROUTEPARAMS}` : `/${subDir}/${rdata.NAME ? rdata.NAME : ""}`)
                    expressApp[rdata.METHOD.toLowerCase()](rdata.ROUTEPARAMS ? `/${subDir}/${rdata.NAME ? rdata.NAME : ""}:${rdata.ROUTEPARAMS}` : `/${subDir}/${rdata.NAME ? rdata.NAME : ""}`, (...params) => rdata.execute(...params))
                }
            })
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = InitHttpServer