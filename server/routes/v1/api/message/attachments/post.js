const saveAttachment = rootRequire("server/data-access/functions/message/saveAttachment");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    saveAttachment(req)
    .then(fileData => {
        resolve(fileData);
    })
    .catch(error => {
        reject("Attachment not saved: " + createErrorMessage(error));
    });
}

module.exports = Post;
