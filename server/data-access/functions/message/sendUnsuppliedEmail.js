const mailService = rootRequire('server/services/mail');

function SendUnsuppliedEmail(recipients, requiredValue, cb) {
    let toList = recipients.map(rec => rec.email);
    let names = recipients.map(rec => rec.playerName);
    if (toList.length === 0) {
        return cb(null);
    }
    mailService.sendUnsuppliedEmail(toList, names, requiredValue, cb);
}

module.exports = SendUnsuppliedEmail;
