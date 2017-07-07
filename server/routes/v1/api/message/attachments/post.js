const saveAttachment = rootRequire("server/data-access/functions/message/saveAttachment");

function Post(req, res, next) {
    console.log("in saveAttachment");
    saveAttachment(req, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Attachment not saved: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Post;
