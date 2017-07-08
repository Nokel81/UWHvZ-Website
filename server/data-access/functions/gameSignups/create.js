const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function Create(gameSignUp, cb, skipDoFindByGame) {
    gameSignUp = new GameSignUp(gameSignUp);
    gameSignUp.validate(err => {
        if (err) {
            return cb({error: err});
        }
        gameSignUp.save(err => {
            if (err) {
                return cb({error: err});
            }
            if (!skipDoFindByGame) {
                findByGame(gameSignUp.gameId, cb);
            } else {
                cb({body: "User signed up and Email confirmation has been sent"});
            }
        });
    });
}

module.exports = Create;
