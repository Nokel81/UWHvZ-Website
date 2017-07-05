const Session = rootRequire("server/schemas/session");

function HasSession(req, res, next) {
    Session.findOne({
        sessionToken: (req.headers["set-cookie"] || [])[0]
    }).exec((err, session) => {
        if (err) {
            return res.status(401).send("Session Expired");
        }
        next();
    });
}

module.exports = function () {
    return HasSession;
};
