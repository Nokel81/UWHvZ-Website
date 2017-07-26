const create = rootRequire("server/data-access/functions/supplyCode/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const {codes, gameId} = req.body;
    create(codes, gameId)
    .then(codes => {
        resolve(codes);
    })
    .catch(error => {
        reject("Supply codes not created: " + createErrorMessage(error));
    });
}

module.exports = Post;
