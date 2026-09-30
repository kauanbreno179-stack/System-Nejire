const fs = require("fs-extra");
const {
    imageToWebp2,
    videoToWebp2,
    writeExifImg2,
    writeExifVid2
} = require("../sticker/exif.js");

async function criarFigurinhaImagem(buffer, metadata = {}) {
    if (metadata.packname || metadata.author) {
        const filePath = await writeExifImg2(buffer, metadata);
        const out = fs.readFileSync(filePath);
        fs.removeSync(filePath);
        return out;
    }
    return imageToWebp2(buffer);
}

async function criarFigurinhaVideo(buffer, metadata = {}) {
    if (metadata.packname || metadata.author) {
        const filePath = await writeExifVid2(buffer, metadata);
        const out = fs.readFileSync(filePath);
        fs.removeSync(filePath);
        return out;
    }
    return videoToWebp2(buffer);
}

module.exports = { criarFigurinhaImagem, criarFigurinhaVideo };
