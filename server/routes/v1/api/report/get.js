const findByGame = rootRequire("server/data-access/functions/report/findByGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {
        gameId
    } = req.query;
    findByGame(gameId, false)
        .then(reports => {
            resolve(reports);
        })
        .catch(error => {
            reject("Game reports not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
