const startGame = rootRequire("server/data-access/functions/game/startGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const {OZemails, gameId, HTMLlore, fileData} = req.body;
    startGame(OZemails, gameId, HTMLlore, fileData)
    .then(message => {
        resolve(message);
    })
    .catch(error => {
        reject("Game not started: " + createErrorMessage(error));
    });
}

module.exports = Post;
