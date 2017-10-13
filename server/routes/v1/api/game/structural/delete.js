const deleteById = rootRequire("server/data-access/functions/game/deleteById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, resolve, reject) {
    const {
        gameId
    } = req.query;
    deleteById(gameId)
        .then(() => {
            resolve("Game deleted");
        })
        .catch(error => {
            reject("Game not removed: " + createErrorMessage(error));
        });
}

module.exports = Delete;
