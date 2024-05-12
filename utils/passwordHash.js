const bcrypt = require("bcrypt")


async function createBlowfishHash(stringData) {
   return  await bcrypt.hash(stringData, 15)
}

async function compareBlowfishHash(stringData, blowfishHash) {
    return await bcrypt.compare(stringData, blowfishHash)
}

module.exports.createBlowFishHash = createBlowfishHash
module.exports.compareBlowFishHash = compareBlowfishHash