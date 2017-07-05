const User = rootRequire("server/schemas/user");

function ConfirmUser(confirmationToken, cb) {
    User.find({confirmationToken})
        .exec((err, user) => {
            if (err) {
                return cb({error: err});
            }
            if (user.length === 0) {
                return cb({body: "User email confirmed"});
            }
            user = user[0];
            user.confirmationToken = undefined;
            user.save(err => {
                if (err) {
                    return cb({error: err});
                }
                cb({body: "User email confirmed"});
            });
        });
}

module.exports = ConfirmUser;
