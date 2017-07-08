const pbkdf2 = require("pbkdf2").pbkdf2;
const randomString = require("crypto-random-string");

const User = rootRequire("server/schemas/user");
const signUp = rootRequire("server/data-access/functions/gameSignups/create");
const Settings = rootRequire("server/schemas/settings");
const playerCode = rootRequire("server/helpers/playerCode");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const mailService = rootRequire("server/services/mail");

function Create(user, cb) {
    user.nonce = randomString(25);
    user.playerCode = playerCode();
    user.confirmationToken = randomString(25);
    let teamPreference = user.teamPreference;
    pbkdf2(user.password, Buffer.from(user.nonce, "utf8"), 128, 256, "sha512", (err, key) => {
        if (err) {
            return cb({error: err});
        }
        user.password = key.toString("hex");
        const newUser = new User(user);
        const userSettings = new Settings({
            userId: newUser._id,
            gameEmails: true,
            promotionalEmails: true
        });
        newUser.validate(err => {
            if (err) {
                return cb({error: err});
            }
            mailService.sendConfirmationEmail(newUser, "https://uwhvz.uwaterloo.ca/user?token=" + user.confirmationToken, (err, res) => {
                if (err) {
                    return cb({error: err});
                }
                newUser.save(err => {
                    if (err) {
                        return cb({error: err});
                    }
                    userSettings.save(err => {
                        if (err) {
                            return cb({error: err});
                        }
                        if (teamPreference) {
                            findCurrentOrNext(res => {
                                if (res.error) {
                                    return cb(res);
                                }
                                if (!res.body) {
                                    return cb({body: "Email confirmation has been sent. There is no game to sign up for."});
                                }
                                signUp({
                                    userEmail: user.email,
                                    teamPreference: teamPreference,
                                    gameId: res.body._id
                                }, cb, true);
                            });
                        } else {
                            cb({body: "Email confirmation has been sent"});
                        }
                    });
                });
            });
        });
    });
}

module.exports = Create;
