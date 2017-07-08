const User = rootRequire("server/schemas/user");
const mailService = rootRequire("server/services/mail");
const randomString = require("crypto-random-string");

function ConfirmUser(email, cb) {
    User.findOne({email})
        .exec((err, user) => {
            if (err) {
                return cb({error: err});
            }
            if (!user) {
                return cb({error: "User not found"});
            }
            user.passwordResetCode = randomString(30);
            user.save((err, user) => {
                if (err) {
                    return cb({error: err});
                }
                const confirmationLink = "https://uwhvz.uwaterloo.ca/passwordReset?code=" + user.passwordResetCode;
                mailService.sendPasswordResetEmail(user, confirmationLink, (err, res) => {
                    if (err) {
                        return cb({error: err});
                    }
                    cb({body: "Password reset email has been sent"});
                });
            });
        });
}

module.exports = ConfirmUser;
