const sendPasswordResetEmail = rootRequire("server/data-access/functions/user/sendPasswordResetEmail");

function Post(req, res, next) {
    sendPasswordResetEmail(req.body.email, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Email not sent: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Post;
