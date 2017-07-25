const create = rootRequire("server/data-access/functions/polygons/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const polygon = req.body;
    create(req.body)
    .then(polygons => {
        res.status(200).json(polygons);
    })
    .catch(error => {
        res.status(404).send("Polygon not created: " + createErrorMessage(error));
    });
}

module.exports = Post;
