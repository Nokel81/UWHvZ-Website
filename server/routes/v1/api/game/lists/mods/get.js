const findPlayerCodes = rootRequire("server/data-access/functions/game/findPlayerCodes");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {gameId, userId} = req.query;
    findPlayerCodes(gameId, userId)
    .then(codes => {
        resolve(codes);
    })
    .catch(error => {
        reject("Player codes not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
