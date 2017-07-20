const Promise = require('bluebird');

const findCurrentOrNext = rootRequire('server/data-access/functions/game/findCurrentOrNext');
const Report = rootRequire('server/schemas/report');

function GetReports(userId) {
    return new Promise(function(resolve, reject) {
        let graph = [];
        let zombieCount = 0;
        let stunCount = 0;
        findCurrentOrNext()
        .then(game => {
            if (game.humans.indexOf(userId) >= 0 || !userId || userId == "null" || userId == "undefined") {
                zombieCount = game.originalZombies.length;
            }
            graph.push({
                x: game.startDate,
                y: zombieCount,
                group: "Zombies"
            });
            graph.push({
                x: game.startDate,
                y: stunCount,
                group: "Stuns"
            });
            return Report.find({gameId: game._id, ratified: true}).sort("time").exec();
        })
        .then(reports => {
            reports.forEach(report => {
                if (report.reportType === "Stun") {
                    stunCount++;
                    graph.push({
                        x: report.time,
                        y: stunCount,
                        group: "Stuns"
                    });
                } else {
                    zombieCount++;
                    graph.push({
                        x: report.time,
                        y: zombieCount,
                        group: "Zombies"
                    });
                }
            });
            resolve(graph);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = GetReports;
