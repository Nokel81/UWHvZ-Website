const getUserRecipients = rootRequire("server/data-access/functions/message/getUserRecipients");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {
        userId,
        userType,
        isSuper
    } = req.headers;
    getUserRecipients(userId, userType, isSuper)
        .then(recipients => {
            resolve(recipients);
        })
        .catch(error => {
            reject("Recipients not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
