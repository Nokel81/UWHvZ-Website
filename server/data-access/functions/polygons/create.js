const Promise = require('bluebird');

const Polygon = rootRequire("server/schemas/polygon");
const getAll = rootRequire("server/data-access/functions/polygons/getAll");

function Create(poly) {
    return new Promise(function(resolve, reject) {
        const polygon = new Polygon(poly);
        polygon.validate()
        .then(noerror => {
            return polygon.save();
        })
        .then(poly => {
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

module.exports = Create;
