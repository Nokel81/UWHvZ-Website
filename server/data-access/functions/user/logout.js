const Promise = require('bluebird');

const Session = rootRequire("server/schemas/session");

function Logout(sessionToken) {
    return new Promise(function(resolve, reject) {
        Session.remove({sessionToken})
        .exec()
        .then(session => {
            resolve("Logged out");
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = Logout;
