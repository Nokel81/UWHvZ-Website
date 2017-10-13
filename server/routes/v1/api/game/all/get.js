const findAll = rootRequire("server/data-access/functions/game/findAll");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    findAll()
        .then(games => {
            resolve(games);
        })
        .catch(error => {
            reject("Games not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
