const GameSignUp = rootRequire("server/schemas/gameSignUp");
const User = rootRequire("server/schemas/user");

function FindById(gameId, cb) {
    GameSignUp.find({gameId})
        .exec((err, signUps) => {
            if (err) {
                return cb({error: err});
            }
            const emails = signUps.map(signUp => signUp.userEmail);
            User.find({
                email: {
                    $in: emails
                }
            })
            .exec((err, users) => {
                if (err) {
                    return cb({error: err});
                }
                const res = [];
                signUps.forEach(signUp => {
                    res.push({
                        userEmail: signUp.userEmail,
                        _id: signUp._id,
                        gameId: signUp.gameId,
                        teamPreference: signUp.teamPreference,
                        name: users.find(user => signUp.userEmail === user.email).playerName
                    });
                });
                res.sort((a, b) => {
                    const A = a.toUpperCase();
                    const B = b.toUpperCase();
                    if (A < B) {
                        return -1;
                    }
                    if (A > B) {
                        return 1;
                    }
                    return 0;
                })
                cb({body: res});
            });
        });
}

module.exports = FindById;
