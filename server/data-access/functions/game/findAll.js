const Game = rootRequire("server/schemas/game");
const findById = rootRequire("server/data-access/functions/game/findById");

function FindAll(cb) {
    Game.find({})
        .sort("startDate")
        .select("_id")
        .exec((err, games) => {
            if (err) {
                return cb({error: err});
            }
            let gameCount = 0;
            let errored = false;
            const resGames = [];
            games.forEach((game, index) => {
                resGames.push();
                if (errored) {
                    return;
                }
                findById(game, res => {
                    if (res.error) {
                        if (errored) {
                            return;
                        }
                        return cb(res);
                    }
                    resGames[index] = res.body;
                    gameCount++;
                    if (gameCount === games.length) {
                        cb({body: resGames});
                    }
                });
            });
        });
}

module.exports = FindAll;
