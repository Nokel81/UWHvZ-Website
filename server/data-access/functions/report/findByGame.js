const Promise = require("bluebird");

const Report = rootRequire("server/schemas/report");
const User = rootRequire("server/schemas/user");
const findById = rootRequire("server/data-access/functions/game/findById");
const getDateString = rootRequire("server/helpers/getDateString");
const clone = rootRequire("server/helpers/clone");
const secondsPerDay = 86400000;

function daysBetween(d1, d2) {
    return Math.round((d2.getTime() - d1.getTime()) / secondsPerDay);
}

function FindUnratified(gameId, needToBeRatified) {
    return new Promise(function(resolve, reject) {
        let gameDays = [];
        let game = null;
        findById(gameId)
            .then(gameObj => {
                game = gameObj;
                const QUERY = needToBeRatified ? Report.find({
                    gameId,
                    ratified: false
                }) : Report.find({
                    gameId
                });
                return QUERY.sort("time").exec();
            })
            .then(reports => {
                let firstDay = new Date(game.startDate);
                let days = daysBetween(new Date(game.startDate), new Date(game.endDate));
                for (let i = 0; i < days; i++) {
                    gameDays.push({
                        startTime: firstDay.toISOString(),
                        title: getDateString(firstDay, true)
                    });
                    firstDay.setDate(firstDay.getDate() + 1);
                }

                return Promise.map(clone(reports), report => {
                    return new Promise(function(resolve, reject) {
                        User.findOne({
                            _id: report.tagger
                        })
                            .select("playerName")
                            .exec()
                            .then(user => {
                                report.taggerName = user.playerName;
                                report.day = gameDays.findIndex(day => day.startTime > report.time);
                                report.day = report.day < 0 ? days + report.day : report.day - 1;
                                return User.findOne({
                                    _id: report.tagged
                                }).select("playerName").exec();
                            })
                            .then(user => {
                                report.taggedName = user.playerName;
                                report.timeString = getDateString(report.time);
                                resolve(report);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    });
                });
            })
            .then(reports => {
                let collections = gameDays.map(day => {
                    return {
                        name: day.title,
                        reports: []
                    };
                });
                reports.forEach(report => {
                    collections[report.day].reports.push(report);
                    delete report.day;
                });
                resolve(collections);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindUnratified;
