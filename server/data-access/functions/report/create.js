const Report = rootRequire("server/schemas/report");
const getUserType = rootRequire("server/data-access/functions/user/getUserType");
const mailService = rootRequire("server/services/mail");
const getUserByPlayerCode = rootRequire("server/data-access/functions/user/getUserByPlayerCode");

function Create(report, cb) {
    const newReport = new Report(report);
    newReport.validate(err => {
        if (err) {
            return cb({error: err});
        }
        getUserByPlayerCode(newReport.taggerCode, res => {
            if (res.error) {
                return cb(res);
            }
            let tagger = res.body;
            getUserType(tagger._id, taggerRes => {
                if (taggerRes.error) {
                    return cb(res);
                }
                let taggerType = taggerRes.body;
                if (taggerType !== "Human" && taggerType !== "Zombie") {
                    return cb({error: "You have to be either a Human or a Zombie"});
                }
                getUserByPlayerCode(newReport.taggedCode, res => {
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
                        newReport.save((err, report) => {
                            if (err) {
                                return cb({error: err});
                            }
                            mailService.sendTaggedEmail(tagged, report, err => {
                                if (err) {
                                    return cb({error: err});
                                }
                                if (taggerType === "Human") {
                                    mailService.sendTaggerEmail(tagger, report, err => {
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
