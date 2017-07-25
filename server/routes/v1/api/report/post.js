const create = rootRequire("server/data-access/functions/report/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const report = req.body;
    create(report)
    .then(message => {
        res.status(201).json(message);
    })
    .catch(error => {
        res.status(400).send("Event report not made: " + createErrorMessage(error));
    });
}

module.exports = Post;
