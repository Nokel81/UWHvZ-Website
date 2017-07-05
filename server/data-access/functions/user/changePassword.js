const User = rootRequire("server/schemas/user");
const hashPassword = rootRequire("server/helpers/hashPassword");

function ConfirmUser(passwordChange, cb) {
    User.findOne({_id: passwordChange.userId})
        .exec((err, user) => {
            if (err) {
                return cb({error: err});
            }
            if (!user) {
                return cb({error: "User not found"});
            }
            const hashedOldPassword = hashPassword(passwordChange.oldPassword, user.nonce);
            if (typeof hashedOldPassword === "object") {
                return cb({error: hashedOldPassword});
            }
            if (hashedOldPassword !== user.password) {
                return cb({error: "Old password is incorrect"});
            }
            const hashedNewPassword = hashPassword(passwordChange.newPassword, user.nonce);
            if (typeof hashedOldPassword === "object") {
                return cb({error: hashedNewPassword});
            }
            User.findOneAndUpdate({_id: user._id}, {$set: {password: hashedNewPassword}})
                .exec((err, user) => {
                    if (err) {
                        return cb({error: err});
                    }
                    cb({body: "Password changed"});
                });
        });
}

module.exports = ConfirmUser;
