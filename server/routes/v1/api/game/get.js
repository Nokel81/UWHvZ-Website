const findById = rootRequire("server/data-access/functions/game/findById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {id} = req.query;
    findById(id)
    .then(game => {
        res.status(200).json(game);
    })
    .catch(error => {
        res.status(400).send("Game not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
