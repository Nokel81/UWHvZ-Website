const Promise = require("bluebird");
const randomString = require("crypto-random-string");
const NeverBounce = require("neverbounce/src/NeverBounce");

const User = rootRequire("server/schemas/user");
const signUp = rootRequire("server/data-access/functions/gameSignups/create");
const hashPassword = rootRequire("server/helpers/hashPassword");
const Settings = rootRequire("server/schemas/settings");
const playerCode = rootRequire("server/helpers/playerCode");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const mailService = rootRequire("server/services/mail");

const client = new NeverBounce("secret_9d17e380fd9e37180d449757eb31d8a5");

function Create(user) {
    user.nonce = randomString(25);
    user.playerCode = playerCode();
    user.confirmationToken = randomString(25);
    let teamPreference = user.teamPreference;
    return new Promise(function(resolve, reject) {
        hashPassword(user.password, user.nonce)
            .then(password => {
                user.password = password;
                user = new User(user);
                return user.validate();
            })
            .then(() => {
                return new Promise(function(resolve, reject) {
                    client.single.check(user.email)
                        .then(res => {
                            if (res.is("valid")) {
                                resolve();
                            } else {
                                reject("Your Email is invalid");
                            }
                        }, () => {
                            reject("Your Email is invalid");
                        });
                });
            })
            .then(() => {
                return mailService.sendConfirmationEmail(user);
            })
            .then(() => {
                return user.save();
            })
            .then(user => {
                return new Settings({
                    userId: user._id
                }).save();
            })
            .then(() => {
                if (!teamPreference) {
                    return resolve("Email confirmation has been sent");
                }
                return findCurrentOrNext(true);
            })
            .then(game => {
                if (!game) {
                    return resolve("Email confirmation has been sent. There is no game to sign up for");
                }
                return signUp({
                    userEmail: user.email,
                    teamPreference: teamPreference,
                    gameId: game._id
                }, true);
            })
            .then(message => {
                resolve(message);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Create;
