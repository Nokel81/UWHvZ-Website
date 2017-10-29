const ms = require("ms");

module.exports = function (req, res, next) {
    req.setTimeout(ms("10m"));
    next();
};
