const getAll = rootRequire("server/data-access/functions/buildingLocations/getAll");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    getAll()
    .then(locations => {
        resolve(locations);
    })
    .catch(error => {
        reject("Polygons not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
