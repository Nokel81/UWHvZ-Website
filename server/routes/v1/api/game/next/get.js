const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    findCurrentOrNext()
        .then(game => {
            resolve(game);
        })
        .catch(error => {
            reject("Game not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
