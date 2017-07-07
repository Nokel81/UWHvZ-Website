const User = rootRequire("server/schemas/user");
const getUserType = rootRequire("server/data-access/functions/user/getUserType");
const recipientCodes = rootRequire("server/constants.json").recipientCodes;

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
                let recipients = [{
                    title: "Moderators",
                    value: recipientCodes.toModerators
                },{
                    title: "Webmaster",
                    value: recipientCodes.toWebmaster
                }];
                const type = user.email === "webmaster.uwhvz@gmail.com" ? "Moderator" : res.body;
                if (type === "NonPlayer" || type === "Spectator") {
                    return cb({body: recipients});
                }
                if (type === "Human") {
                    recipients.push({
                        title: "Humans",
                        value: recipientCodes.toAllPlayers
                    });
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
                    title: "All Players",
                    value: recipientCodes.toAllPlayers
                });
                recipients.push({
                    title: "All Users",
                    value: recipientCodes.toAllUsers
                });
                User.find({email: {$ne: "webmaster.uwhvz@gmail.com"}})
                    .select("_id playerName")
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
        });
}

module.exports = GetUserRecipients;
