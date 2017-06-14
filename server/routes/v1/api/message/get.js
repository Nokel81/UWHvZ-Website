const query = rootRequire("server/data-access/functions/message/query");

function Get(req, res, next) {
    query(req.body.query, req.body.sort, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Could not find message: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Get;
