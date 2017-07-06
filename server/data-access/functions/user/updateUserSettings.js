const Settings = rootRequire("server/schemas/settings");

function UpdateUserSettings(newSettings, cb) {
    Settings.findOneAndUpdate({
        _id: newSettings._id,
        userId: newSettings.userId
    }, {
        $set: {
            gameEmails: newSettings.gameEmails,
            promotionalEmails: newSettings.promotionalEmails
        }
    }, (err, settings) => {
        if (err) {
            return cb({error: err});
        }
        cb({body: settings});
    });
}

module.exports = UpdateUserSettings;
