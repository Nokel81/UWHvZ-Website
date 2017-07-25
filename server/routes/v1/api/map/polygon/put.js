const updatedById = rootRequire("server/data-access/functions/polygons/updatedById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, res, next) {
    const polygon = req.body;
    updatedById(polygon)
    .then(polygons => {
        res.status(200).json(polygons);
    })
    .catch(error => {
        res.status(404).send("Polygon not updated: " + createErrorMessage(error));
    });
}

module.exports = Put;
// -80.557908;
