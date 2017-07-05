const BuildingLocation = rootRequire("server/schemas/buildingLocation");
const getAll = rootRequire("server/data-access/functions/buildingLocations/getAll");

function Create(marker, cb) {
    const location = new BuildingLocation(marker);
    location.validate(err => {
        if (err) {
            return cb({error: err});
        }
        location.save(err => {
            if (err) {
                return cb({error: err});
            }
            getAll(cb);
        });
    });
}

module.exports = Create;
