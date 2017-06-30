const updateById = rootRequire("server/data-access/functions/gameSignups/updateById");

function Put(req, res, next) {
    updateById(req.body, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Signup not updated: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Put;
