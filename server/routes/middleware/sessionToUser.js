const findBySession = rootRequire('server/data-access/functions/user/findBySession');

module.exports = function (req, res, next) {
    if (typeof req.headers.cookie !== "string") {
        return next();
    }
    const cookies = req.headers.cookie.split("; ")
        .map(cookie => cookie.split("="))
        .reduce((sum, elem) => {
            sum[elem[0]] = elem[1];
            return sum;
        }, {});
    if (!cookies.session) {
        return next();
    }
    findBySession(cookies.session)
    .then(user => {
        req.headers.userId = user._id;
        next();
    })
    .catch(error => {
        next();
    });
};
