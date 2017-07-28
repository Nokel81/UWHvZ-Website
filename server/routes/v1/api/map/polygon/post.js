const create = rootRequire("server/data-access/functions/polygons/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const polygon = req.body;
    create(req.body)
    .then(polygons => {
        resolve(polygons);
    })
    .catch(error => {
        reject("Polygon not created: " + createErrorMessage(error));
    });
}

module.exports = Post;
