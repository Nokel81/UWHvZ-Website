const User = rootRequire("server/schemas/user");

module.exports = {
    isAsync: true,
    validator(value, respond) {
        User.find({
            playerCode: value
        }).exec((err, users) => {
            respond(!err && users.length === 1);
        });
    },
    message: "Message must be from a valid player's code"
};
