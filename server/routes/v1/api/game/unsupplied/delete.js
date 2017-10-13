const unsuppliedDeath = rootRequire("server/data-access/functions/game/unsuppliedDeath");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, resolve, reject) {
    const {
        gameId
    } = req.query;
    unsuppliedDeath(gameId)
        .then(() => {
            resolve("Unsupplied are no more");
        })
        .catch(error => {
            reject("Unsupplied not killed: " + createErrorMessage(error));
        });
}

module.exports = Delete;
