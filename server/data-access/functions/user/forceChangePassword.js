const User = rootRequire("server/schemas/user");
const hashPassword = rootRequire("server/helpers/hashPassword");

function ForcePasswordChange(passwordReset, cb) {
    User.findOne({passwordResetCode: passwordReset.code})
        .exec((err, user) => {
            if (err) {
                return cb({error: err});
            }
            if (!user) {
                return cb({body: "Password has been changed"});
            }
            const hashedNewPassword = hashPassword(passwordReset.newPassword, user.nonce);
            if (typeof hashedOldPassword === "object") {
                return cb({error: hashedOldPassword});
            }
            User.findOneAndUpdate({_id: user._id}, {$set: {password: hashedNewPassword, passwordResetCode: undefined}})
                .exec((err, user) => {
                    if (err) {
                        return cb({error: err});
                    }
                    cb({body: "Password has been changed"});
                });
        });
}

module.exports = ForcePasswordChange;
