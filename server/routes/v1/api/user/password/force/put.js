const forceChangePassword = rootRequire("server/data-access/functions/user/forceChangePassword");

function Put(req, res, next) {
    forceChangePassword(req.body, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Password not changed: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Put;
