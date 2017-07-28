const Promise = require('bluebird');
const randomString = require("crypto-random-string");

const User = rootRequire("server/schemas/user");
const hashPassword = rootRequire("server/helpers/hashPassword");
const findByEmail = rootRequire("server/data-access/functions/user/findByEmail");
const Session = rootRequire("server/schemas/session");

function Login(account) {
    return new Promise(function(resolve, reject) {
        let user = null;
        findByEmail(account.username)
        .then(userObj => {
            user = userObj;
            if (user.confirmationToken) {
                return reject("User email has not yet been confirmed");
            }
            return hashPassword(account.password, user.nonce);
        })
        .then(password => {
            if (user.password !== password) {
                return reject("Email or password incorrect");
            }
            return new Session({userId: user._id, sessionToken: randomString(25)}).save();
        })
        .then(session => {
            delete user.password;
            delete user.nonce;
            resolve({session, user});
        })
        .catch(error => {
            reject("Email or password incorrect");
        });
    });
}

module.exports = Login;
