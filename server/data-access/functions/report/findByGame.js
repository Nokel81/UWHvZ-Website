const Report = rootRequire("server/schemas/report");
const User = rootRequire("server/schemas/user");
const findById = rootRequire("server/data-access/functions/game/findById");
const getDateString = rootRequire("server/helpers/getDateString");

function daysBetween(d1, d2) {
    const N = 86400000;
    return Math.round((d1.getTime() - d2.getTime()) / N);
}

function FindUnratified(gameId, needToBeRatified, cb) {
    findById(gameId, res => {
        if (res.error) {
            return cb(res);
        }
        let game = res.body;
        const QUERY = needToBeRatified ? Report.find({gameId, ratified: false}) : Report.find({gameId});
        QUERY.sort("time")
        .exec((err, reports) => {
            if (err) {
                return cb({error: err});
            }
            if (reports.length === 0) {
                return cb({body: []});
            }
            let count = 0;
            let errored = false;
            let resPorts = [];
            let dayNames = [];
            let dayValues = [];
            let collections = [];
            let firstDay = new Date(game.startDate.getTime());
            for (let i = 0; i < daysBetween(game.startDate, game.endDate); i++) {
                days.push(getDateString(firstDay, true));
                dayValues.push(firstDay.getTime());
                firstDay.setDate(firstDay.getDate() + 1);
            }
            days = days.reverse();
            dayValues = dayValues.reverse();
            dayValues.pop();

            reports.forEach((report, index) => {
                resPorts.push();
                if (errored) {
                    return;
                }
                let rep = JSON.parse(JSON.stringify(report));
                User.findOne({_id: rep.tagger})
                    .select("playerName")
                    .exec((err, user) => {
                        if (err) {
                            if (errored) {
                                return;
                            }
                            errored = true;
                            return cb({error: err});
                        }
                        if (!user) {
                            if (errored) {
                                return;
                            }
                            errored = true;
                            return cb({error: "Tagger not found"});
                        }
                        rep.taggerName = user.playerName;
                        User.findOne({_id: rep.tagged})
                            .select("playerName")
                            .exec((err, user) => {
                                if (err) {
                                    if (errored) {
                                        return;
                                    }
                                    errored = true;
                                    return cb({error: err});
                                }
                                if (!user) {
                                    if (errored) {
                                        return;
                                    }
                                    errored = true;
                                    return cb({error: "Tagged not found"});
                                }
                                rep.taggedName = user.playerName;
                                rep.time = getDateString(new Date(rep.time));
                                rep.timeValue = (new Date(rep.time)).getTime();
                                resPorts[index] = rep;
                                count++;
                                if (count === reports.length) {
                                    let collection = [];
                                    resPorts.forEach(report => {
                                        if (report.timeValue < dayValues[dayValues.length - 1]) {
                                            delete report.timeValue;
                                            collection.push(report);
                                        } else {
                                            collections.push({
                                                name: days[days.length - 1],
                                                reports: collection
                                            });
                                            days.pop();
                                            dayValues.pop();
                                        }
                                    });

                                    cb({body: collections});
                                }
                            });
                    });
            });
        });
    });
}

module.exports = FindUnratified;
