const BuildingLocation = rootRequire("server/schemas/buildingLocation");
const getAll = rootRequire("server/data-access/functions/buildingLocations/getAll");

function UpdateById(maker, cb) {
    BuildingLocation.findByIdAndRemove(marker._id)
        .exec((err, settings) => {
            if (err) {
                return cb({ error: err });
            }
            getAll(cb);
        });
};

module.exports = UpdateById;
