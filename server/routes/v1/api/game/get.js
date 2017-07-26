const findById = rootRequire("server/data-access/functions/game/findById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {id} = req.query;
    findById(id)
    .then(game => {
        resolve(game);
    })
    .catch(error => {
        reject("Game not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
