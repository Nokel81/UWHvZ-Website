const Promise = require("bluebird");

const Polygon = rootRequire("server/schemas/polygon");
const getAll = rootRequire("server/data-access/functions/polygons/getAll");

function DeleteById(poly) {
    return new Promise(function(resolve, reject) {
        Polygon.findByIdAndRemove(poly._id)
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

module.exports = DeleteById;
