const deleteById = rootRequire("server/data-access/functions/buildingLocations/deleteById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {id} = req.query;
    deleteById(id)
    .then(locations => {
        res.status(200).send(locations);
    })
    .catch(error => {
        res.status(404).send("Polygons not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
