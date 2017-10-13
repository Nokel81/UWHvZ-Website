const Promise = require("bluebird");

const Settings = rootRequire("server/schemas/settings");

function FindUserSettings(userId) {
    return new Promise(function(resolve, reject) {
        Settings.findOne({
            userId
        })
            .exec()
            .then(settings => {
                resolve(settings);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindUserSettings;
