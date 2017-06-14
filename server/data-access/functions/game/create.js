const Game = rootRequire("server/schemas/game");

function Create (game, cb) {
    game = new Game(game);
    game.save(err => {
        if (err) {
            return cb({ error: err });
        }
        cb({ body: game });
    });
};

module.exports = Create;
