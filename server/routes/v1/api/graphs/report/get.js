const getReports = rootRequire("server/data-access/functions/graphs/getReports");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {
        userType,
        isSuper
    } = req.headers;
    getReports(userType, isSuper)
        .then(graph => {
            resolve(graph);
        })
        .catch(error => {
            reject("Trees not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
