const findByUser = rootRequire("server/data-access/functions/report/findByUser");

function Get(req, res, next) {
    findByUser(req.query.userId, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Report not found: " + result.error);
        } else {
            res.status(201).send(result.body);
        }
    });
}

module.exports = Get;
