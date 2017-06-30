const deleteById = rootRequire("server/data-access/functions/gameSignups/deleteById");

function Delete(req, res, next) {
    deleteById(req.query.id, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Signups not removed: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Delete;
