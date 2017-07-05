const Polygon = rootRequire("server/schemas/polygon");
const getAll = rootRequire("server/data-access/functions/polygons/getAll");

function Create(poly, cb) {
    const polygon = new Polygon(poly);
    polygon.validate(err => {
        if (err) {
            return cb({error: err});
        }
        polygon.save(err => {
            if (err) {
                return cb({error: err});
            }
            getAll(cb);
        });
    });
}

module.exports = Create;
