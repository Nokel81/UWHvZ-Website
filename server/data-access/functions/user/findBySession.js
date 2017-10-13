const Promise = require("bluebird");

const findById = rootRequire("server/data-access/functions/user/findById");
const Session = rootRequire("server/schemas/session");

function FindBySession(sessionToken) {
    return new Promise(function(resolve, reject) {
        Session.findOne({
            sessionToken
        })
            .select("-password -nonce")
            .exec()
            .then(session => {
                return findById(session.userId);
            })
            .then(user => {
                resolve(user);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindBySession;
