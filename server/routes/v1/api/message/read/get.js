const query = rootRequire("server/data-access/functions/readStatus/query");

function Get(req, res, next) {
    query(req.query.query, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Could not find read status: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Get;
