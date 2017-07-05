const pbkdf2 = require("pbkdf2").pbkdf2Sync;

function HashPassword(password, nonce) {
    try {
        return pbkdf2(password, Buffer.from(nonce, "utf8"), 128, 256, "sha512").toString("hex");
    } catch (e) {
        return e;
    }
}

module.exports = HashPassword;
