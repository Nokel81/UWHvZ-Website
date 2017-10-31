const getAll = rootRequire("server/data-access/functions/graphs/getAllTrees");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {
        userType,
        isSuper
    } = req.headers;
    getAll(userType, isSuper)
        .then(graphs => {
            resolve(graphs);
        })
        .catch(error => {
            reject("Trees not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
