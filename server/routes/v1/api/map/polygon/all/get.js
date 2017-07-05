const getAll = rootRequire("server/data-access/functions/polygons/getAll");

function get(req, res, next) {
    getAll(result => {
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
