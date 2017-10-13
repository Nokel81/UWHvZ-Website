const useSupplyCode = rootRequire("server/data-access/functions/supplyCode/useSupplyCode");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const code = req.body;
    useSupplyCode(code)
        .then(message => {
            resolve(message);
        })
        .catch(error => {
            reject("Supply codes not used: " + createErrorMessage(error));
        });
}

module.exports = Get;
