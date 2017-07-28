const deleteById = rootRequire("server/data-access/functions/polygons/deleteById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, resolve, reject) {
    const {id} = req.query;
    deleteById(id)
    .then(polygons => {
        resolve(polygons);
    })
    .catch(error => {
        reject("Polygon not removed: " + createErrorMessage(error));
    });
}

module.exports = Delete;
