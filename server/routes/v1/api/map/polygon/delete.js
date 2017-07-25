const deleteById = rootRequire("server/data-access/functions/polygons/deleteById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, res, next) {
    const {id} = req.query;
    deleteById(id)
    .then(polygons => {
        res.status(200).json(polygons);
    })
    .catch(error => {
        res.status(404).send("Polygon not removed: " + createErrorMessage(error));
    });
}

module.exports = Delete;
