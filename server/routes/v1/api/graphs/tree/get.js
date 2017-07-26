const getAll = rootRequire("server/data-access/functions/graphs/getAllTrees");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {userId} = req.query;
    getAll(userId)
    .then(graphs => {
        resolve(graphs);
    })
    .catch(error => {
        reject("Trees not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
