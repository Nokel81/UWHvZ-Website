const Promise = require("bluebird");

const Polygon = rootRequire("server/schemas/polygon");
const getAll = rootRequire("server/data-access/functions/polygons/getAll");

function UpdateById(poly) {
    return new Promise(function(resolve, reject) {
        Polygon.updateOne({
            _id: poly._id
        }, poly)
            .exec()
            .then(() => {
                return getAll();
            })
            .then(polygons => {
                resolve(polygons);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = UpdateById;
