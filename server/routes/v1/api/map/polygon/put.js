const updatedById = rootRequire("server/data-access/functions/polygons/updatedById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, resolve, reject) {
    const polygon = req.body;
    updatedById(polygon)
    .then(polygons => {
        resolve(polygons);
    })
    .catch(error => {
        reject("Polygon not updated: " + createErrorMessage(error));
    });
}

module.exports = Put;
// -80.557908;
