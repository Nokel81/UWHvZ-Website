const getAll = rootRequire("server/data-access/functions/graphs/getAllTrees");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {userId} = req.query;
    getAll(userId)
    .then(graphs => {
        res.status(200).json(graphs);
    })
    .catch(error => {
        res.status(404).send("Trees not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
