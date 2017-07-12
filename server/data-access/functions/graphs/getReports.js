const findCurrentOrNext = rootRequire('server/data-access/functions/game/findCurrentOrNext');
const Report = rootRequire('server/schemas/report');

function GetReports(userId, cb) {
    findCurrentOrNext(res => {
        if (res.error) {
            return cb(res);
        }
        let game = res.body;
        let graph = [];
        let isHumanKnowledge = lastGame.humans.indexOf(userId) >= 0 || !userId || userId == "null" || userId == "undefined";

        let zombieCount = 0;
        let stunCount = 0;
        if (!isHumanKnowledge) {
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

        Report.find({gameId: game._id, ratified: true})
            .sort("time")
            .exec((err, reports) => {
                if (err) {
                    return cb({error: err});
                }

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

                cb({body: graph});
            });
    });
}

module.exports = GetReports;
