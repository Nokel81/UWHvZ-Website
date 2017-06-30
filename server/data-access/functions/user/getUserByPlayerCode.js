const User = rootRequire("server/schemas/user");

function GetUserByPlayerCode(code, cb) {
    User.findOne({ playerCode: code })
        .select("-password -nonce")
        .exec((err, user) => {
            if (err) {
                return cb({ error: err });
            }
            if (!user || Object.keys(user).length === 0) {
                return cb({ error: "Could not find playerCode" });
            }
            cb({ body: user });
        });
};

module.exports = GetUserByPlayerCode;
