const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function Create(gameSignUp, cb) {
    gameSignUp = new GameSignUp(gameSignUp);
    gameSignUp.validate(err => {
        if (err) {
            return cb({error: err});
        }
        gameSignUp.save(err => {
            if (err) {
                return cb({error: err});
            }
            findByGame(gameSignUp.gameId, cb);
        });
    });
}

module.exports = Create;
