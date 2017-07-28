const Promise = require('bluebird');

const GameSignUp = rootRequire("server/schemas/gameSignUp");
const User = rootRequire("server/schemas/user");
const clone = rootRequire("server/helpers/clone");

function FindById(gameId) {
    return new Promise(function(resolve, reject) {
        let signups = [];
        GameSignUp.find({gameId}).sort("userEmail")
        .exec()
        .then(signupList => {
            signups = signupList;
            let emails = signups.map(signUp => signUp.userEmail);
            return User.find({email: {$in: emails}}).sort("email").exec();
        })
        .then(users => {
            return Promise.map(clone(users), (user, index) => {
                return new Promise(function(resolve, reject) {
                    let signUp = signups[index];
                    if (signUp.userEmail !== user.email) {
                        return reject("User not found");
                    }
                    resolve({
                        userEmail: signUp.userEmail,
                        _id: signUp._id,
                        gameId: signUp.gameId,
                        teamPreference: signUp.teamPreference,
                        name: user.playerName
                    });
                });
            });
        })
        .then(signups => {
            signups.sort((a, b) => {
                const A = a.name.toUpperCase();
                const B = b.name.toUpperCase();
                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                return 0;
            });
            resolve(signups);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = FindById;
