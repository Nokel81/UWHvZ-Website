const Promise = require('bluebird');

const Settings = rootRequire("server/schemas/settings");

function UpdateUserSettings(settings) {
    return new Promise(function(resolve, reject) {
        Settings.findOneAndUpdate({_id: settings._id, userId: settings.userId}, {$set: settings}, {new: true})
        .exec()
        .then(settings => {
            resolve(settings);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = UpdateUserSettings;
