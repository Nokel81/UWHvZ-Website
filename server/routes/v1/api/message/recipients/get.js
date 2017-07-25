const getUserRecipients = rootRequire("server/data-access/functions/message/getUserRecipients");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {userId} = req.query;
    getUserRecipients(userId)
    .then(recipients => {
        res.status(200).json(recipients);
    })
    .catch(error => {
        res.status(404).send("Recipients not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
