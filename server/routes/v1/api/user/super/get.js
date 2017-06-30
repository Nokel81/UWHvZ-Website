const isSuper = rootRequire("server/data-access/functions/user/isSuper");

function Get(req, res, next) {
    isSuper(req.query.id, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("User not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Get;
