const User = rootRequire("server/schemas/user");

function IsSuper(id, cb) {
    User.findOne({ _id: id })
        .exec((err, user) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: user.email === "webmaster.uwhvz@gmail.com" });
        });
};

module.exports = IsSuper;
