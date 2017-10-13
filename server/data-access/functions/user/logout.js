const Promise = require("bluebird");

const Session = rootRequire("server/schemas/session");

function Logout(sessionToken) {
    return new Promise(function(resolve, reject) {
        Session.remove({
            sessionToken
        })
            .exec()
            .then(() => {
                resolve("Logged out");
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Logout;
