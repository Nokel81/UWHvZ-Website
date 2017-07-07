const pbkdf2 = require("pbkdf2").pbkdf2;
const randomString = require("crypto-random-string");

const User = rootRequire("server/schemas/user");
const Settings = rootRequire("server/schemas/settings");
const playerCode = rootRequire("server/helpers/playerCode");
const gmailService = rootRequire("server/services/gmail");

function Create(user, cb) {
    user.nonce = randomString(25);
    user.playerCode = playerCode();
    user.confirmationToken = randomString(25);
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
            gmailService.sendConfirmationEmail(newUser, "https://uwhvz.uwaterloo.ca/user?token=" + user.confirmationToken, (err, res) => {
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
                        cb({body: "Email confirmation has been sent"});
                    });
                });
            });
        });
    });
}

module.exports = Create;
