const Settings = rootRequire("server/schemas/settings");

function GetUserSettings(id, cb) {
    Settings.findOne({userId: id})
        .exec((err, settings) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: settings});
        });
}

module.exports = GetUserSettings;
