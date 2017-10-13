const findPlayerCodes = rootRequire("server/data-access/functions/game/findPlayerCodes");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const { gameId } = req.query;
    const { userId } = req.headers;
    findPlayerCodes(gameId, userId)
        .then(codes => {
            resolve(codes);
        })
        .catch(error => {
            reject("Player codes not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
