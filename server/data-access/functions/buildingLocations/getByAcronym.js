const BuildingLocation = rootRequire("server/schemas/buildingLocation");

function GetByAcronym(acronym, cb) {
    BuildingLocation.findOne({ acronym: acronym })
        .exec((err, marker) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: marker });
        });
};

module.exports = GetByAcronym;
