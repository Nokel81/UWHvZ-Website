const findByGame = rootRequire("server/data-access/functions/supplyCode/findByGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {
        gameId
    } = req.query;
    findByGame(gameId)
        .then(codes => {
            resolve(codes);
        })
        .catch(error => {
            reject("Supply codes not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
