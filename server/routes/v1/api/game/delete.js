const deleteById = rootRequire("server/data-access/functions/game/deleteById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, res, next) {
    const {id} = req.query;
    deleteById(id)
    .then(noerror => {
        res.sendStatus(204);
    })
    .catch(error => {
        res.status(404).send("Game not removed: " + createErrorMessage(error));
    });
}

module.exports = Delete;
