const create = rootRequire("server/data-access/functions/buildingLocations/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const location = req.body;
    create(location)
    .then(location => {
        res.status(200).json(location);
    })
    .catch(error => {
        res.status(404).send("Polygon not created: " + createErrorMessage(error));
    });
}

module.exports = Get;
