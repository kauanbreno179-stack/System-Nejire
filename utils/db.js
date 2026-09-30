const fs = require("fs-extra");

function ensure(filePath, valorPadrao) {
    fs.ensureDirSync(require("path").dirname(filePath));
    if (!fs.existsSync(filePath)) {
        fs.writeJsonSync(filePath, valorPadrao, { spaces: 2 });
    }
}

function read(filePath, valorPadrao) {
    try {
        return fs.readJsonSync(filePath);
    } catch {
        return valorPadrao;
    }
}

function write(filePath, data) {
    fs.writeJsonSync(filePath, data, { spaces: 2 });
}

module.exports = { ensure, read, write };
