const User = rootRequire("server/schemas/user");

module.exports = {
    isAsync: true,
    validator(value, respond) {
        User.findOne({
            email: value
        }).exec((err, user) => {
            respond(!err && user);
        });
    },
    message: "Email must be from an account"
};
