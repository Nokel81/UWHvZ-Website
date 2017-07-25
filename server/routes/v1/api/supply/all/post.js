const create = rootRequire("server/data-access/functions/supplyCode/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const {codes, gameId} = req.body;
    create(codes, gameId)
    .then(codes => {
        res.status(201).json(codes);
    })
    .catch(error => {
        res.status(404).send("Supply codes not created: " + createErrorMessage(error));
    });
}

module.exports = Post;
