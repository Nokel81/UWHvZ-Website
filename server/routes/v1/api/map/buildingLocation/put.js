const updatedById = rootRequire("server/data-access/functions/buildingLocations/updatedById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const location = req.body;
    updatedById(location)
    .then(location => {
        resolve(location);
    })
    .catch(error => {
        reject("Polygon not updated: " + createErrorMessage(error));
    });
}

module.exports = Get;
