const findBySession = rootRequire('server/data-access/functions/user/findBySession');
const findUserType = rootRequire('server/data-access/functions/user/findUserType');
const isSuper = rootRequire('server/data-access/functions/user/isSuper');

module.exports = function (req, res, next) {
    if (!req.cookies) {
        return next();
    }
    findBySession(req.cookies.session)
    .then(user => {
        req.headers.userId = user._id;
        req.headers.session = req.cookies.session;
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
