const Polygon = rootRequire("server/schemas/polygon");
const getAll = rootRequire("server/data-access/functions/polygons/getAll");

function UpdateById(poly, cb) {
    Polygon.findByIdAndRemove(poly._id)
        .exec((err, settings) => {
            if (err) {
                return cb({error: err});
            }
            getAll(cb);
        });
}

module.exports = UpdateById;
