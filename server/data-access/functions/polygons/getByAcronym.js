const Polygon = rootRequire("server/schemas/polygon");

function GetByAcronym(acronym, cb) {
    Polygon.findOne({acronym})
        .exec((err, marker) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: marker});
        });
}

module.exports = GetByAcronym;
