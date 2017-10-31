const levels = rootRequire("server/constants.json").securityNames;

module.exports = function(req, res, next) {
    if (req.headers.isSuper || req.headers.userType === levels.moderator) {
        next();
    } else {
        res.status(403).send("You do not have access level violet");
    }
};
