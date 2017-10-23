const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");
const playerCode = rootRequire("server/helpers/playerCode");
// const mailService = rootRequire("server/services/mail");

function regenerateCodes() {
    return new Promise(function(resolve, reject) {
        User.find({})
            .exec()
            .each(user => {
                user.playerCode = playerCode();
                return user.save();
            })
            // .each(user => {
            //     return mailService.sendRegeneratedCodeEmail(user);
            // })
            .then(() => {
                console.log("Hello");
                resolve("All Player Codes Regenerated");
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = regenerateCodes;
