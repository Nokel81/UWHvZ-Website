const User = rootRequire("server/schemas/user");

function GetUserById(id, cb) {
    User.findOne({_id: id})
        .select("-password -nonce")
        .exec((err, user) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: user});
        });
}

module.exports = GetUserById;
