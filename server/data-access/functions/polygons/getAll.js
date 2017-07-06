const Polygon = rootRequire("server/schemas/polygon");

function GetAll(cb) {
    Polygon.find({})
        .exec((err, polygons) => {
            if (err) {
                return cb({error: err});
            }
            let game = "#000000";
            let minor = "#0000ff";
            let major = "#ff0000";
            let rail = "#8b4513";
            let safe = "#00ff00";
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
                if (a.colour === rail) {
                    return 1;
                }
                if (b.colour === rail) {
                    return -1;
                }
                if (a.colour === safe) {
                    return 1;
                }
                if (b.colour === safe) {
                    return -1;
                }
                if (a.colour === minor) {
                    return 1;
                }
                if (b.colour === minor) {
                    return -1;
                }
                if (a.colour === major) {
                    return 1;
                }
                if (b.colour === major) {
                    return -1;
                }
                return 0;
            })
            cb({body: polygons});
        });
}

module.exports = GetAll;
