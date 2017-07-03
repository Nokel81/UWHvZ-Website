const updatedById = rootRequire("server/data-access/functions/buildingLocations/updatedById");

function Get(req, res, next) {
    updatedById(req.body, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Polygons not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Get;
