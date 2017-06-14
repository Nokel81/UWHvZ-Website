const getUserByPlayerCode = rootRequire("server/data-access/functions/user/getUserByPlayerCode");

function Get (req, res, next) {
    const playerCode = req.body.playerCode;
    getUserByPlayerCode(playerCode, (result) => {
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
