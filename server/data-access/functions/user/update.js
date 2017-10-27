const Promise = require("bluebird");
const NeverBounce = require("neverbounce/src/NeverBounce");

const User = rootRequire("server/schemas/user");
const findByPlayerCode = rootRequire("server/data-access/functions/user/findByPlayerCode");
const findBasicUserInfo = rootRequire("server/data-access/functions/game/findBasicUserInfo");
const mailService = rootRequire("server/services/mail");

const client = new NeverBounce("secret_9d17e380fd9e37180d449757eb31d8a5");

function Create(newUser) {
    return new Promise(function(resolve, reject) {
        let userObj = null;
        findByPlayerCode(newUser.playerCode)
            .then(oldUser => {
                userObj = oldUser;
                userObj.playerName = newUser.playerName;
                if (userObj.email !== newUser.email) {
                    userObj.email = newUser.email;
                    return new Promise(function(resolve, reject) {
                        client.single.check(userObj.email)
                            .then(res => {
                                if (res.is("valid")) {
                                    resolve(true);
                                } else {
                                    reject("Your Email is invalid");
                                }
                            }, () => {
                                reject("Your Email is invalid");
                            });
                    });
                }
                return Promise.resolve(false);
            })
            .then(changedEmail => {
                if (changedEmail) {
                    return mailService.sendConfirmationEmail(userObj);
                }
                return Promise.resolve();
            })
            .then(() => {
                return userObj.save();
            })
            .then(() => {
                return findBasicUserInfo();
            })
            .then(users => {
                resolve(users);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Create;
