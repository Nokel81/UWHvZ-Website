const mailService = rootRequire('server/services/mail');

function SendStartingEmail(toList, teamName, game, HTMLlore, fileData, cb) {
    if (!Array.isArray(toList)) {
        return cb({error: "toList needs to be an array"});
    }
    if (toList.length === 0) {
        return cb(null);
    }
    mailService.sendStartingEmail(toList, game, HTMLlore, teamName.toLowerCase(), fileData, cb);
}

module.exports = SendStartingEmail;
