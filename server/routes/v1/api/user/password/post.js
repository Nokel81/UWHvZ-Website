const sendPasswordResetEmail = rootRequire("server/data-access/functions/user/sendPasswordResetEmail");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const {email} = req.body;
    sendPasswordResetEmail(email)
    .then(message => {
        res.status(200).send(message);
    })
    .catch(error => {
        res.status(404).send("Email not sent: " + createErrorMessage(error));
    });
}

module.exports = Post;
