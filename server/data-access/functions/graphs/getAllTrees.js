const findAll = rootRequire('server/data-access/functions/game/findAll');
const averageColour = rootRequire('server/helpers/averageColour');
const Report = rootRequire('server/schemas/report');
const Settings = rootRequire('server/schemas/settings');

function GetAllTrees(userId, cb) {
    findAll(res => {
        if (res.error) {
            return cb(res);
        }
        let games = res.body;
        if (games.length === 0) {
            return cb({body: []});
        }
        let trees = [];
        let count = 0;
        let errored = false;
        let lastGame = games[games.length - 1];
        let lastGameIndex = games.length - 1;
        let isHumanKnowledge = lastGame.humans.indexOf(userId) >= 0 || !userId || userId == "null" || userId == "undefined";

        games.forEach((game, index) => {
            if (errored) {
                return;
            }
            if (index === lastGameIndex && isHumanKnowledge) {
                return;
            }
            trees.push();
            let nodes = [{
                id: "OZ",
                label: "Necromancer",
                color: {
                    border: "#000000",
                    background: "#aaaaaa"
                },
                chosen: {
                    node: false
                }
            }];

            Settings.find({userId: {$in: game.zombies}})
                .exec((err, settingObjs) => {
                    if (err) {
                        if (errored) {
                            return;
                        }
                        errored = true;
                        return cb({error: err});
                    }
                    nodes = nodes.concat(game.zombieObjs.map(zombie => {
                        let treeNodeColour = (settingObjs.find(setting => setting.userId.toString() === zombie._id.toString()) || {treeNodeColour: "#0000ff"}).treeNodeColour;
                        return {
                            id: zombie._id,
                            label: zombie.playerName,
                            chosen: {
                                node: false
                            },
                            color: {
                                background: averageColour(treeNodeColour, "#ffffff"),
                                border: treeNodeColour
                            },
                            font: {
                                color: treeNodeColour
                            },
                            borderWidth: 2
                        };
                    }));

                    Report.find({gameId: game._id, reportType: "Tag"})
                        .exec((err, reports) => {
                            if (err) {
                                if (errored) {
                                    return;
                                }
                                errored = true;
                                return cb({error: err});
                            }

                            let edges = reports.map(report => {
                                return {
                                    from: report.tagger,
                                    to: report.tagged,
                                    arrows: {
                                        to: true
                                    },
                                    scaling: {
                                        max: 100
                                    }
                                };
                            });
                            game.originalZombies.forEach(zom => {
                                edges.push({
                                    from: "OZ",
                                    to: zom,
                                    arrows: {
                                        to: true
                                    }
                                });
                            });

                            trees[index] = {nodes, edges, name: game.name};
                            count++;
                            if (count === games.length || (count === games.length - 1 && isHumanKnowledge)) {
                                cb({body: trees});
                            }
                        });
                });
        });
    });
}

module.exports = GetAllTrees;
