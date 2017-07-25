const getReports = rootRequire("server/data-access/functions/graphs/getReports");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {userId} = req.query;
    getReports(userId)
    .then(graph => {
        res.status(200).json(graph);
    })
    .catch(error => {
        res.status(404).send("Trees not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
