const Game = rootRequire("server/schemas/game");
const findAll = rootRequire("server/data-access/functions/game/findAll");

function AddPlayerToGame(oldPlayer, cb) {
    console.log(oldPlayer);
    if (["spectator", "moderator", "human", "zombie"].indexOf(oldPlayer.team) < 0) {
        return cb({error: "Invalid team name"});
    }
    oldPlayer.team += "s";
    let updateQuery = {$pull: {}};
    updateQuery.$pull[oldPlayer.team] = oldPlayer.userId;
    Game.findOneAndUpdate({_id: oldPlayer.gameId}, updateQuery, err => {
        if (err) {
            return cb({error: err});
        }
        findAll(cb);
    });
}

module.exports = AddPlayerToGame;
