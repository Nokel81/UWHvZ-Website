const getUserRecipients = rootRequire("server/data-access/functions/message/getUserRecipients");

function Get(req, res, next) {
    getUserRecipients(req.query.userId, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Recipients not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Get;
