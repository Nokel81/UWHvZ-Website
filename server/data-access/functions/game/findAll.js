const Game = rootRequire("server/schemas/game");
const findById = rootRequire("server/data-access/functions/game/findById");

function FindAll(cb) {
    Game.find({})
        .select("_id")
        .exec((err, games) => {
            if (err) {
                return cb({error: err});
            }
            let gameCount = 0;
            let errored = false;
            const resGames = [];
            games.forEach(game => {
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
                    resGames.push(res.body);
                    gameCount++;
                    if (gameCount === games.length) {
                        resGames.sort((a, b) => {
                            if (a.startDate < b.startDate) {
                                return -1;
                            }
                            if (a.startDate === b.startDate) {
                                return 0;
                            }
                            return 1;
                        });
                        cb({body: resGames});
                    }
                });
            });
        });
}

module.exports = FindAll;
