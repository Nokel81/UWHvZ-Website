const Report = rootRequire("server/schemas/report");
const mailService = rootRequire("server/services/mail");
const getUserType = rootRequire("server/data-access/functions/user/getUserType");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const getUserByPlayerCode = rootRequire("server/data-access/functions/user/getUserByPlayerCode");

function Create(report, cb) {
    findCurrentOrNext(res => {
        if (res.error) {
            return cb(res);
        }
        let game = res.body;
        getUserType(report.tagger, taggerRes => {
            if (taggerRes.error) {
                return cb(res);
            }
            let taggerType = taggerRes.body;
            if (taggerType !== "Human" && taggerType !== "Zombie") {
                return cb({error: "You have to be either a Human or a Zombie"});
            }
            getUserByPlayerCode(report.taggedCode, res => {
                if (res.error) {
                    return cb(res);
                }
                let tagged = res.body;
                getUserType(tagged._id, taggedRes => {
                    if (taggerRes.error) {
                        return cb(res);
                    }
                    let taggedType = taggedRes.body;
                    if (taggedType !== "Human" && taggedType !== "Zombie") {
                        return cb({error: "You have to tag either a Human or a Zombie"});
                    }
                    if (taggedType === taggerType && taggerType === "Zombie") {
                        return cb({error: "You have to tag someone who is on the other team"});
                    }
                    report.tagged = tagged._id;
                    report.gameId = game._id;
                    let newReport = new Report(report);
                    newReport.validate(err => {
                        if (err) {
                            return cb({error: err});
                        }
                        newReport.save((err, report) => {
                            if (err) {
                                return cb({error: err});
                            }
                            mailService.sendTaggedEmail(tagged._id, report, err => {
                                if (err) {
                                    return cb({error: err});
                                }
                                if (taggerType === "Human") {
                                    mailService.sendTaggerEmail(report.tagger, report, err => {
                                        if (err) {
                                            return cb({error: err});
                                        }
                                        cb({body: "You tagged " + newReport.taggedCode});
                                    });
                                } else {
                                    cb({body: "You tagged " + newReport.taggedCode});
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = Create;
