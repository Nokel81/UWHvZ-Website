const findBasicUserInfo = rootRequire("server/data-access/functions/game/findBasicUserInfo");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    findBasicUserInfo()
        .then(info => {
            resolve(info);
        })
        .catch(error => {
            reject("Player info not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
