const findById = rootRequire("server/data-access/functions/message/findById");

function Get(req, res, next) {
    findById(req.query.id, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Could not find message: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Get;
