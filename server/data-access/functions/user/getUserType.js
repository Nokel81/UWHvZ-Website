const Game = rootRequire("server/schemas/game");
const FindCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");

function GetUserType(id, cb) {
    FindCurrentOrNext(function (res) {
        if (res.error) {
            cb({ error: res.error });
        } else {
            let game = res.body;
            if (game.moderators.indexOf(id) >= 0) {
                cb({ body: "Moderator" });
            } else if (game.zombies.indexOf(id) >= 0) {
                cb({ body: "Zombie" });
            } else if (game.humans.indexOf(id) >= 0) {
                cb({ body: "Human" });
            } else {
                cb({ body: "NonPlayer" });
            }
        }
    });
};

module.exports = GetUserType;
