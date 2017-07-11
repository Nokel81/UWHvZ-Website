const Report = rootRequire("server/schemas/report");
const User = rootRequire("server/schemas/user");
const getDateString = rootRequire("server/helpers/getDateString");

function FindUnratified(gameId, needToBeRatified, cb) {
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
                                resPorts[index] = rep;
                                count++;
                                if (count === reports.length) {
                                    cb({body: resPorts});
                                }
                            });
                    });
            });
        });
}

module.exports = FindUnratified;
