const findAll = rootRequire("server/data-access/functions/game/findAll");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    findAll()
    .then(games => {
        res.status(200).json(games);
    })
    .catch(error => {
        res.status(404).send("Games not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
