module.exports = function (req, res, next) {
    if (req.headers.userType === "Moderator") {
        next();
    } else {
        res.status(403).send("You are not a moderator");
    }
};
