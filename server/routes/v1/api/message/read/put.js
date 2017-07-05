const createOrUpdate = rootRequire("server/data-access/functions/readStatus/createOrUpdate");

function Put(req, res, next) {
    const usercode = req.body.usercode;
    const _id = req.body.messageId;
    const status = req.body.isRead;
    createOrUpdate(usercode, _id, status, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Could not find create or update status: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Put;
