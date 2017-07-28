const Session = rootRequire("server/schemas/session");

function HasSession(req, res, next) {
    Session.findOne({sessionToken: (req.headers["set-cookie"] || [])[0]})
    .exec()
    .then(session => {
        next();
    })
    .catch(error => {
        return reject("Session Expired");
    });
}

module.exports = function () {
    return HasSession;
};
