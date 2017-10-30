const Promise = require("bluebird");

const findAll = rootRequire("server/data-access/functions/game/findAll");
const averageColour = rootRequire("server/helpers/averageColour");
const Report = rootRequire("server/schemas/report");
const Settings = rootRequire("server/schemas/settings");
const clone = rootRequire("server/helpers/clone");

function GetAllTrees(userId) {
    return new Promise(function(resolve, reject) {
        // return resolve([]);
        findAll()
            .then(games => {
                let lastGame = games[games.length - 1];
                let isInGame = !userId || lastGame.humans.findIndex(x => x.toString() === userId.toString()) >= 0;
                if (isInGame && new Date(lastGame.endDate) >= new Date()) {
                    games.pop();
                }
                return Promise.map(clone(games), game => {
                    return new Promise(function(resolve, reject) {
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
                        let edges = [];
                        let zombiesToKeep = ["OZ"];

                        Settings.find({
                            userId: {
                                $in: game.zombies
                            }
                        })
                            .exec()
                            .then(settings => {
                                game.zombieObjs.forEach(zombie => {
                                    let treeNodeColour = settings.find(setting => setting.userId.toString() === zombie._id.toString()).treeNodeColour;
                                    nodes.push({
                                        id: zombie._id.toString(),
                                        label: zombie.playerName,
                                        chosen: {
                                            node: false
                                        },
                                        color: {
                                            background: averageColour(treeNodeColour, "#ffffff"),
                                            border: treeNodeColour
                                        },
                                        font: {
                                            color: "#000000"
                                        }
                                    });
                                });
                                return Report.find({
                                    gameId: game._id,
                                    reportType: "Tag",
                                    ratified: true
                                }).select("tagger tagged").exec();
                            })
                            .then(reports => {
                                reports.forEach(report => {
                                    if (zombiesToKeep.indexOf(report.tagger.toString()) < 0) {
                                        zombiesToKeep.push(report.tagger.toString());
                                    }
                                    if (zombiesToKeep.indexOf(report.tagged.toString()) < 0) {
                                        zombiesToKeep.push(report.tagged.toString());
                                    }
                                    edges.push({
                                        from: report.tagger,
                                        to: report.tagged,
                                        arrows: {
                                            to: true
                                        },
                                        scaling: {
                                            max: 100
                                        }
                                    });
                                });
                                game.originalZombies.forEach(zom => {
                                    if (zombiesToKeep.indexOf(zom.toString()) < 0) {
                                        zombiesToKeep.push(zom.toString());
                                    }
                                    edges.push({
                                        from: "OZ",
                                        to: zom,
                                        arrows: {
                                            to: true
                                        }
                                    });
                                });
                                nodes = nodes.filter(node => zombiesToKeep.indexOf(node.id) >= 0);
                                // TODO: Add the surviving humans
                                resolve({
                                    nodes,
                                    edges,
                                    name: game.name + " - " + new Date(game.startDate).getFullYear()
                                });
                            })
                            .catch(error => {
                                reject(error);
                            });
                    });
                });
            })
            .then(trees => {
                resolve(trees);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = GetAllTrees;
