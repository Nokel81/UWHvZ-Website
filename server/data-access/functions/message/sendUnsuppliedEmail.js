const Promise = require('bluebird');

const mailService = rootRequire('server/services/mail');

function SendUnsuppliedEmail(recipients, requiredValue) {
    return new Promise(function(resolve, reject) {
        let toList = recipients.map(rec => rec.email);
        let names = recipients.map(rec => rec.playerName);
        if (toList.length === 0) {
            return resolve();
        }
        mailService.sendUnsuppliedEmail(toList, names, requiredValue)
        .then(res => {
            resolve(res);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = SendUnsuppliedEmail;
