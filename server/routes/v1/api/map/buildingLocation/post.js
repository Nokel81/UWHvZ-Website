const create = rootRequire("server/data-access/functions/buildingLocations/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const location = req.body;
    create(location)
        .then(location => {
            resolve(location);
        })
        .catch(error => {
            reject("Polygon not created: " + createErrorMessage(error));
        });
}

module.exports = Get;
