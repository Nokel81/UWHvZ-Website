const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function FindById(gameId, cb) {
    findByGame(gameId, res => {
        if (res.error) {
            cb(res);
        }
        res = res.filter(signUp => signUp.teamPreference === "Zombie");
        cb({body: res});
    });
}

module.exports = FindById;
