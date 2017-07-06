const Polygon = rootRequire("server/schemas/polygon");

function GetAll(cb) {
    Polygon.find({})
        .sort("name")
        .exec((err, polygons) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: polygons});
        });
}

module.exports = GetAll;
