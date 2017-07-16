const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");

function GetUserType(id, cb) {
    findCurrentOrNext(res => {
        if (res.error) {
            return cb({error: res.error});
        }
        const game = res.body;
        id = id.toString();
        if (!game) {
            cb({body: "NonPlayer"});
        } else if (game.moderators.indexOf(id) >= 0) {
            cb({body: "Moderator"});
        } else if (game.zombies.indexOf(id) >= 0) {
            cb({body: "Zombie"});
        } else if (game.humans.indexOf(id) >= 0) {
            cb({body: "Human"});
        } else if (game.spectators.indexOf(id) >= 0) {
            cb({body: "Spectator"});
        } else {
            cb({body: "NonPlayer"});
        }
    }, true);
}

module.exports = GetUserType;
