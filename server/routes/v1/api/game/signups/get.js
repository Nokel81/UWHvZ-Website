const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {gameId} = req.query;
    findByGame(gameId)
    .then(signups => {
        resolve(signups);
    })
    .catch(error => {
        reject("Signups not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
