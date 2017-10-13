const getUserRecipients = rootRequire("server/data-access/functions/message/getUserRecipients");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {
        userId
    } = req.headers;
    getUserRecipients(userId)
        .then(recipients => {
            resolve(recipients);
        })
        .catch(error => {
            reject("Recipients not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
