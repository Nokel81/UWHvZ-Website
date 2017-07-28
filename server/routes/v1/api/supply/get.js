const findByUser = rootRequire("server/data-access/functions/supplyCode/findByUser");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {userId, gameId} = req.query;
    findByUser(userId, gameId)
    .then(codes => {
        resolve(codes);
    })
    .catch(error => {
        reject("Supply codes not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
