const Promise = require('bluebird');

const mailService = rootRequire('server/services/mail');

function SendStartingEmail(toList, teamName, game, HTMLlore, fileData) {
    return new Promise(function(resolve, reject) {
        if (!Array.isArray(toList)) {
            return reject("toList needs to be an array");
        }
        if (toList.length === 0) {
            return resolve();
        }
        mailService.sendStartingEmail(toList, game, HTMLlore, teamName.toLowerCase(), fileData)
        .then(res => {
            resolve(res);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = SendStartingEmail;
