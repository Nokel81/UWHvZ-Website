const getPlayerCodePage = rootRequire("server/data-access/functions/user/getPlayerCodePage");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {
        userId
    } = req.headers;
    getPlayerCodePage(userId)
        .then(buffer => {
            resolve(buffer, "application/pdf");
        })
        .catch(error => {
            reject("Password not changed: " + createErrorMessage(error));
        });
}

module.exports = Get;
