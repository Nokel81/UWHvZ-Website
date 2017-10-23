const allowCharacters = "abcdefghjkmnpqrtuvwxyz2346789";

function PlayerCode(length) {
    if (typeof length !== "number") {
        length = 6;
    }
    let res = "";
    while (res.length < length) {
        res += allowCharacters[Math.floor(Math.random() * allowCharacters.length)];
    }
    return res;
}

module.exports = PlayerCode;
