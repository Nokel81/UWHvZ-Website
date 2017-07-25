const saveAttachment = rootRequire("server/data-access/functions/message/saveAttachment");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    saveAttachment(req)
    .then(fileData => {
        res.status(200).json(fileData);
    })
    .catch(error => {
        res.status(404).send("Attachment not saved: " + createErrorMessage(error));
    });
}

module.exports = Post;
