const sendMessage = rootRequire("server/data-access/functions/message/sendMessage");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const message = req.body;
    sendMessage(message)
        .then(message => {
            resolve(message);
        })
        .catch(error => {
            reject("Message not sent: " + createErrorMessage(error));
        });
}

module.exports = Post;
