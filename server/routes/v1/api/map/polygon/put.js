const updatedById = rootRequire("server/data-access/functions/polygons/updatedById");

function get(req, res, next) {
    updatedById(req.body, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Polygons not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = get;
// -80.557908;