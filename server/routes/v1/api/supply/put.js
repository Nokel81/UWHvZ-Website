const useSupplyCode = rootRequire("server/data-access/functions/supplyCode/useSupplyCode");

function Get(req, res, next) {
    useSupplyCode(req.body, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            if (typeof result.error === "string") {
                res.status(404).send(result.error);
            } else {
                let errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
                res.status(404).send("SupplyCode not used: " + errors);
            }
        } else {
            res.status(201).send(result.body);
        }
    });
};

module.exports = Get;
