const getAll = rootRequire("server/data-access/functions/polygons/getAll");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function get(req, res, next) {
    getAll()
    .then(polygons => {
        res.status(200).json(polygons);
    })
    .catch(error => {
        res.status(404).send("Polygons not found: " + createErrorMessage(error));
    });
}

module.exports = get;
