const User = rootRequire("server/schemas/user");
const getUserType = rootRequire("server/data-access/functions/user/getUserType");
const findAll = rootRequire("server/data-access/functions/game/findAll");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const recipientCodes = rootRequire("server/constants.json").recipientCodes;

const webmasterEmail = "webmaster.uwhvz@gmail.com";

function GetUserRecipients(userId, cb) {
    User.findOne({_id: userId})
        .exec((err, user) => {
            if (err) {
                return cb({error: err});
            }
            if (!user) {
                return cb({error: "User not found"});
            }
            getUserType(userId, res => {
                if (res.error) {
                    return cb(res);
                }
                findCurrentOrNext(res => {
                    if (res.error) {
                        return cb(res);
                    }
                    let hasCurrentGame = res.body !== null;
                    findAll(res => {
                        if (res.error) {
                            return cb(res);
                        }
                        let games = res.body;
                        let recipients = [{
                            title: "Webmaster",
                            value: recipientCodes.toWebmaster
                        }];
                        if (hasCurrentGame) {
                            recipients.push({
                                title: "Moderators",
                                value: recipientCodes.toModerators
                            });
                        }
                        const type = user.email === webmasterEmail ? "Moderator" : res.body;
                        const isSuper = user.email === webmasterEmail;
                        if (type === "NonPlayer" || type === "Spectator") {
                            return cb({body: recipients});
                        }
                        if (isSuper) {
                            recipients = recipients.concat(games.map(game => {
                                return {
                                    title: game.name + " - All Participents",
                                    value: "#" + game._id
                                };
                            }));
                        }
                        if (!hasCurrentGame) {
                            return cb({body: recipients});
                        }
                        recipients.push({
                            title: "All Players",
                            value: recipientCodes.toAllPlayers
                        });
                        if (type === "Human") {
                            return cb({body: recipients});
                        }
                        recipients.push({
                            title: "Zombies",
                            value: recipientCodes.toZombies
                        });
                        if (type === "Zombie") {
                            return cb({body: recipients});
                        }
                        recipients.push({
                            title: "Humans",
                            value: recipientCodes.toHumans
                        });
                        recipients.push({
                            title: "All Users",
                            value: recipientCodes.toAllUsers
                        });
                        User.find({email: {$ne: "webmaster.uwhvz@gmail.com"}})
                            .select("_id playerName")
                            .sort("playerName")
                            .exec((err, users) => {
                                if (err) {
                                    return cb({error: err});
                                }
                                users.forEach(user => {
                                    recipients.push({
                                        title: user.playerName,
                                        value: user._id
                                    });
                                });
                                return cb({body: recipients});
                            });
                    });
                }, true);
            });
        });
}

module.exports = GetUserRecipients;
