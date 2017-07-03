const allow_characters = "abcdefghjkmnpqrtuvwxyz2346789";

function PlayerCode(length) {
    if (typeof length !== "Number") {
        length = 10;
    }
    let res = "";
    while (res.length < length) {
        res += allow_characters[Math.floor(Math.random() * allow_characters.length)];
    }
    return res;
}

module.exports = PlayerCode;
