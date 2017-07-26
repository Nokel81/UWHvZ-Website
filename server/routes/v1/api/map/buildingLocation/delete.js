const deleteById = rootRequire("server/data-access/functions/buildingLocations/deleteById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {id} = req.query;
    deleteById(id)
    .then(locations => {
        resolve(locations);
    })
    .catch(error => {
        reject("Polygons not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
