const getUserType = rootRequire("server/data-access/functions/user/getUserType");

function Get(req, res, next) {
    getUserType(req.query.id, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("User not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Get;
