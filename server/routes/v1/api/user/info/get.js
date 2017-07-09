const getUserInfo = rootRequire("server/data-access/functions/user/getUserInfo");

function Get(req, res, next) {
    getUserInfo(req.query.id, req.query.infoType, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("User not found: " + result.error);
        } else {
            res.status(200).json(result.body);
        }
    });
}

module.exports = Get;
