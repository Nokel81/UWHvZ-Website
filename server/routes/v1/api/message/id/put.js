const updateById = rootRequire("server/data-access/functions/message/updateById");

function Put(req, res, next) {
    updateById(req.body.id, req.body.update, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Could not update message: " + result.error);
        } else {
            res.status(202).send(result.body);
        }
    });
}

module.exports = Put;
