const update = rootRequire("server/data-access/functions/game/update");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, resolve, reject) {
    const game = req.body;
    const {
        userId,
        isSuper
    } = req.headers;
    update(game, userId, isSuper)
        .then(game => {
            resolve(game);
        })
        .catch(error => {
            reject("Game not updated: " + createErrorMessage(error));
        });
}

module.exports = Put;
