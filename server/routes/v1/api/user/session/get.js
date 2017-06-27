const getUserBySession = rootRequire("server/data-access/functions/user/getUserBySession");

function Get(req, res, next) {
    getUserBySession(req.query.session, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Session not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Get;
