const User = rootRequire("server/schemas/user");

function GetUserById(id, cb) {
    User.findOne({ _id: id })
        .exec((err, user) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: user });
        });
};

module.exports = GetUserById;
