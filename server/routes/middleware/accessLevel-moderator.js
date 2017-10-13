module.exports = function(req, res, next) {
    if (req.headers.isSuper || req.headers.userType === "Moderator") {
        next();
    } else {
        res.status(403).send("You do not have access level violet");
    }
};
