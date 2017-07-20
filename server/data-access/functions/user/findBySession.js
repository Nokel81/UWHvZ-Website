const User = rootRequire("server/schemas/user");
const Session = rootRequire("server/schemas/session");

function GetUserBySession(token, cb) {
    Session.findOne({sessionToken: token})
        .select("-password -nonce")
        .exec((err, session) => {
            if (err) {
                return cb({error: err});
            }
            User.findOne({_id: session.userId})
                .exec((err, user) => {
                    if (err) {
                        return cb({error: err});
                    }
                    cb({body: user});
                });
        });
}

module.exports = GetUserBySession;
