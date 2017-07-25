const sendMessage = rootRequire("server/data-access/functions/message/sendMessage");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const message = req.body;
    sendMessage(message)
    .then(message => {
        res.status(200).json(message);
    })
    .catch(error => {
        res.status(404).send("Message not sent: " + createErrorMessage(error));
    });
}

module.exports = Post;
