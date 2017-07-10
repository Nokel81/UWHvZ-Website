const Game = rootRequire("server/schemas/game");
const getUserByPlayerCode = rootRequire("server/data-access/functions/user/getUserByPlayerCode");
const findAll = rootRequire("server/data-access/functions/game/findAll");

function AddPlayerToGame(newPlayer, cb) {
    if (["spectator", "moderator", "human", "zombie"].indexOf(newPlayer.team) < 0) {
        return cb({error: "Invalid team name"});
    }
    newPlayer.team += "s";
    getUserByPlayerCode(newPlayer.playerCode, res => {
        if (res.error) {
            return cb(res);
        }
        let user = res.body;
        let updateQuery = {$push: {}};
        updateQuery.$push[newPlayer.team] = user._id;
        Game.findOneAndUpdate({_id: newPlayer.gameId}, updateQuery, err => {
            if (err) {
                return cb({error: err});
            }
            findAll(cb);
        });
    });
}

module.exports = AddPlayerToGame;
