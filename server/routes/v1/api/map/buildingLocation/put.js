const updatedById = rootRequire("server/data-access/functions/buildingLocations/updatedById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const location = req.body;
    updatedById(location)
    .then(location => {
        res.status(200).json(location);
    })
    .catch(error => {
        res.status(404).send("Polygon not updated: " + createErrorMessage(error));
    });
}

module.exports = Get;
