module.exports = function(req, res, next) {
    if (req.headers.userId) {
        next();
    } else {
        res.status(403).send("You do not have access level yellow"); //Logged in
    }
};
