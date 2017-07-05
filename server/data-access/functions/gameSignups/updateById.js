const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function Update(signUp, cb) {
    GameSignUp.findOneAndUpdate({_id: signUp._id}, signUp)
        .exec((err, signUp) => {
            if (err) {
                return cb({error: err});
            }
            findByGame(signUp.gameId, cb);
        });
}

module.exports = Update;
