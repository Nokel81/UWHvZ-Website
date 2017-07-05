const Polygon = rootRequire("server/schemas/polygon");
const getAll = rootRequire("server/data-access/functions/polygons/getAll");

function UpdateById(poly, cb) {
    Polygon.findOneAndUpdate({_id: poly._id}, poly, (err, settings) => {
        if (err) {
            return cb({error: err});
        }
        getAll(cb);
    });
}

module.exports = UpdateById;
