const BuildingLocation = rootRequire("server/schemas/buildingLocation");

function GetAll(cb) {
    BuildingLocation.find({})
        .sort("acronym")
        .exec((err, markers) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: markers});
        });
}

module.exports = GetAll;
