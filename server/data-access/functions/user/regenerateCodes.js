const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");
const playerCode = rootRequire("server/helpers/playerCode");
const mailService = rootRequire("server/services/mail");

function regenerateCodes() {
    return new Promise(function(resolve, reject) {
        User.find({})
            .exec()
            .then(users => {
                const saving = [];
                users.forEach(user => {
                    user.playerCode = playerCode();
                    saving.push(user.save());
                });
                return Promise.all(saving);
            })
            .then(saved => {
                const sending = [];
                saved.forEach(user => {
                    sending.push(mailService.sendRegeneratedCodeEmail(user));
                });
                return Promise.all(sending);
            })
            .then(() => {
                resolve("All Player Codes Regenerated");
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = regenerateCodes;
