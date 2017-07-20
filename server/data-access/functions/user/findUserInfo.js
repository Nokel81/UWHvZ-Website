const getUserType = rootRequire("server/data-access/functions/user/findUserType");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const findTeamScore = rootRequire("server/data-access/functions/game/findTeamScore");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");

function GetUserBySession(userId, infoType, cb) {
    infoType = infoType.toLowerCase();
    if (infoType === "score") {
        findCurrentOrNext(res => {
            if (res.error) {
                return cb(res);
            }
            let game = res.body;
            if (game.startDate >= new Date().toISOString()) {
                return cb({body: "Game has not started yet"});
            }
            findUserScore(game._id, userId, cb);
        });
    } else if (infoType === "teamscore") {
        findCurrentOrNext(res => {
            if (res.error) {
                return cb(res);
            }
            let game = res.body;
            if (game.startDate >= new Date().toISOString()) {
                return cb({body: "Game has not started yet"});
            }
            getUserType(userId, res => {
                if (res.error) {
                    return cb(res);
                }
                let team = res.body;
                findTeamScore(game._id, team, cb);
            });
        });
    } else if (infoType === "type") {
        getUserType(userId, cb);
    } else {
        cb({error: "Invalid infotype"});
    }
}

module.exports = GetUserBySession;
