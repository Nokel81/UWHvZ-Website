const findByUser = rootRequire("server/data-access/functions/supplyCode/findByUser");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {userId, gameId} = req.query;
    findByUser(userId, gameId)
    .then(codes => {
        res.status(201).json(codes);
    })
    .catch(error => {
        res.status(404).send("Supply codes not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
