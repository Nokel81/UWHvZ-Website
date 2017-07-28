const Promise = require('bluebird');

const Polygon = rootRequire("server/schemas/polygon");
const game = "#000000";
const minor = "#0000ff";
const major = "#ff0000";
const rail = "#8b4513";
const safe = "#00ff00";

function GetAll() {
    return new Promise(function(resolve, reject) {
        Polygon.find({})
        .exec()
        .then(polygons => {
            polygons.sort((a, b) => {
                if (a.colour === b.colour) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name === b.name) {
                        return 0;
                    }
                    return 1;
                }
                if (a.colour === game) {
                    return -1;
                }
                if (b.colour === game) {
                    return 1;
                }
                if ([rail, safe, minor, major].indexOf(a.colour) >= 0) {
                    return 1;
                }
                return -1;
            });
            resolve(polygons);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = GetAll;
