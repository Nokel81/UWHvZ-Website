const isSuper = rootRequire("server/data-access/functions/user/isSuper");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {userId} = req.query;
    isSuper(userId)
    .then(isSuper => {
        resolve(isSuper);
    })
    .catch(error => {
        reject("User not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
