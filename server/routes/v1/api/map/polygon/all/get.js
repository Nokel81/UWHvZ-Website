const getAll = rootRequire("server/data-access/functions/polygons/getAll");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    getAll()
    .then(polygons => {
        resolve(polygons);
    })
    .catch(error => {
        reject("Polygons not found: " + createErrorMessage(error));
    });
}

module.exports = get;
