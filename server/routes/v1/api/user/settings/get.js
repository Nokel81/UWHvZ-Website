const getUserSettings = rootRequire("server/data-access/functions/user/getUserSettings");

function Get(req, res, next) {
    getUserSettings(req.query.userId, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Settings not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Get;
