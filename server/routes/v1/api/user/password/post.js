const sendPasswordResetEmail = rootRequire("server/data-access/functions/user/sendPasswordResetEmail");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const {email} = req.body;
    sendPasswordResetEmail(email)
    .then(message => {
        resolve(message);
    })
    .catch(error => {
        reject("Email not sent: " + createErrorMessage(error));
    });
}

module.exports = Post;
