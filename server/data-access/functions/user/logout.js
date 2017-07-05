const Session = rootRequire("server/schemas/session");

function Logout(session, cb) {
    Session.remove({sessionToken: session})
        .exec(err => {
            if (err) {
                return cb({error: err});
            }
            cb();
        });
}

module.exports = Logout;
