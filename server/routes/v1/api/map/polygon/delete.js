const deleteById = rootRequire("server/data-access/functions/polygons/deleteById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, resolve, reject) {
    const {polygonId} = req.query;
    deleteById(polygonId)
    .then(polygons => {
        resolve(polygons);
    })
    .catch(error => {
        reject("Polygon not removed: " + createErrorMessage(error));
    });
}

module.exports = Delete;
