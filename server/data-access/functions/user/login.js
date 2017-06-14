const pbkdf2 = require("pbkdf2").pbkdf2;
const randomString = require("crypto-random-string");

const User = rootRequire("server/schemas/user");
const Session = rootRequire("server/schemas/session");

function Login(account, cb) {
    if (!account) {
        return cb({ error: "Account not defined" });
    }
    if (typeof account.username !== "string") {
        return cb({ error: "username is not a string" });
    }
    if (typeof account.password !== "string") {
        return cb({ error: "password is not a string" });
    }
    User.findOne({ email: account.username })
        .exec((err, user) => {
            if (err) {
                return cb({ error: err });
            }
            pbkdf2(account.password, Buffer.from(user.nonce, "utf8"), 128, 256, "sha512", (err, key) => {
                if (err) {
                    return cb({ error: err });
                }
                key = key.toString("hex");
                if (user.password === key) {
                    const session = new Session({
                        userId: user._id,
                        sessionToken: randomString(25)
                    });
                    session.save((err, session) => {
                        if (err) {
                            return cb({ error: err });
                        }
                        delete user.password;
                        delete user.nonce;
                        cb({
                            body: {
                                session: session.sessionToken,
                                user: user
                            }
                        });
                    });
                }
            });
        });
};

module.exports = Login;
