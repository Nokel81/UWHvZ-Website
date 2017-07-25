const getAll = rootRequire("server/data-access/functions/buildingLocations/getAll");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    getAll()
    .then(locations => {
        res.status(200).json(locations);
    })
    .catch(error => {
        res.status(404).send("Polygons not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
