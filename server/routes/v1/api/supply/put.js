const useSupplyCode = rootRequire("server/data-access/functions/supplyCode/useSupplyCode");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const code = req.body;
    useSupplyCode(code)
    .then(message => {
        res.status(201).json(message);
    })
    .catch(error => {
        res.status(404).send("Supply codes not used: " + createErrorMessage(error));
    });
}

module.exports = Get;
