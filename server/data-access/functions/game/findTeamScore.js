const findById = rootRequire("server/data-access/functions/game/findById");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");

function FindTeamScore(gameId, team, cb) {
    findById(gameId, res => {
        if (res.error) {
            return cb(res);
        }
        let game = res.body;
        let players = [];
        if (team === "Human") {
            players = game.humans;
        } else if (team === "Zombie") {
            players = game.zombies;
        } else if (team === "Moderator") {
            return cb({body: Number.MAX_VALUE});
        } else {
            return cb({body: 0});
        }
        let score = 0;
        let returned = false;
        let count = 0;
        players.forEach(player => {
            if (returned) {
                return;
            }
            findUserScore(gameId, player, (res) => {
                if (res.error) {
                    if (!returned) {
                        returned = true;
                        return cb(res);
                    }
                }
                score += res.body;
                count++;
                if (count === players.length) {
                    cb({body: score});
                }
            }, true);
        });
    });
}

module.exports = FindTeamScore;
