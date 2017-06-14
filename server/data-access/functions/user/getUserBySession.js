const User = rootRequire("server/schemas/user");
const Session = rootRequire("server/schemas/session");

function GetUserBySession(token, cb) {
    Session.findOne({ sessionToken: token })
        .exec((err, session) => {
            if (err) {
                return cb({ error: err });
            }
            User.findOne({ _id: session.userId })
                .exec((err, user) => {
                    if (err) {
                        return cb({ error: err });
                    }
                    delete user.password;
                    delete user.nonce;
                    cb({ body: user });
                });
        });
};

module.exports = GetUserBySession;
