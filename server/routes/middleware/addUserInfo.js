const findBySession = rootRequire('server/data-access/functions/user/findBySession');
const findUserType = rootRequire('server/data-access/functions/user/findUserType');
const isSuper = rootRequire('server/data-access/functions/user/isSuper');

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
        req.headers.session = cookies.session;
        return findUserType(user._id);
    })
    .then(type => {
        req.headers.userType = type;
        return isSuper(req.headers.userId);
    })
    .then(isSuper => {
        req.headers.isSuper = isSuper;
        next();
    })
    .catch(error => {
        next();
    });
};
