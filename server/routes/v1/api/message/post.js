const sendMessage = rootRequire("server/data-access/functions/message/sendMessage");

function Post(req, res, next) {
    sendMessage(req.body, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            console.log(result);
            res.status(404).send("Message not sent: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Post;
