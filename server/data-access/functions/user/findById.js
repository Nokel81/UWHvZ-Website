const User = rootRequire("server/schemas/user");

function GetUserById(id, cb) {
    User.findOne({_id: id})
        .select("-password -nonce")
        .exec((err, user) => {
            if (err) {
                return cb({error: err});
            }
            if (!user) {
                return cb({error: "User not found"});
            }
            cb({body: user});
        });
}

module.exports = GetUserById;
