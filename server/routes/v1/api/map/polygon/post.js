const create = rootRequire("server/data-access/functions/polygons/create");

function get(req, res, next) {
    create(req.body, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Polygons not created: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = get;
