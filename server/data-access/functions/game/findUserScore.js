const Report = rootRequire("server/schemas/report");
const User = rootRequire("server/schemas/user");
const SupplyCode = rootRequire("server/schemas/supplyCode");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getGetOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getDateString(date) {
    let hours = date.getHours();
    let noonHalf = "AM"
    if (hours >= 12) {
        noonHalf = "PM";
    }
    return days[date.getDay()] + " " + months[date.getMonth()] + " " + getGetOrdinal(date.getDate()) + " " + date.getFullYear() + " at " + hours + ":" + date.getMinutes() + noonHalf;
}

function FindUserScore(gameId, playerId, cb, forTeamScore) {
    let reportScore = null;
    let supplyCodeScore = null;
    let finalScore = 0;
    let finishedParts = 0;

    let finish = function () {
        if (supplyCodeScore && reportScore) {
            return cb({body: {reportScore, supplyCodeScore}});
        }
        if (finishedParts === 2) {
            return cb({body: finalScore});
        }
    };

    SupplyCode.find({
        forGame: gameId,
        usedBy: playerId
    })
    .exec((err, codes) => {
        if (err) {
            return cb({error: err});
        }
        let score = 0;
        let codeCount = {};
        codes.forEach(code => {
            score += code.value;
            if (forTeamScore) {
                return;
            }
            if (code.value.toString() in codeCount) {
                codeCount[code.value.toString()]++;
            } else {
                codeCount[code.value.toString()] = 1;
            }
        });
        if (forTeamScore) {
            finalScore += score;
            finishedParts++;
            return finish();
        }
        let descriptions = Object.keys(codeCount)
            .sort((a,b) => Number(a) < Number(b) ? -1 : Number(a) === Number(b) ? 0 : 1)
            .map(codeValue => {
                if (codeCount[codeValue] === 1) {
                    return "1 supply code worth " + codeValue + " points";
                } else {
                    return codeCount[codeValue] + " supply codes worth " + codeValue + " points";
                }
            });
        supplyCodeScore = {descriptions, score};
        finish();
    });

    Report.find({gameId})
        .sort("time")
        .exec((err, reports) => {
            if (err) {
                return cb({error: err});
            }
            let player = playerId.toString();

            if (forTeamScore) {
                let score = 0;
                let stunTimes = {}; //This is the object that stores the last time a zombie was stunned (for point regeneration)
                reports.forEach(report => {
                    let tagger = report.tagger.toString();
                    let tagged = report.tagged.toString();
                    let thisTimeTagged = report.time.getTime();
                    if (report.reportType === "Tag") {
                        if (tagger === player) {
                            score += 5;
                        }
                        return;
                    }
                    if (tagged in stunTimes) {
                        let lastTimeTagged = stunTimes[tagged].time.getTime(); //This is in milliseconds since Unix Epoch (signed)
                        let timeDiff = thisTimeTagged - lastTimeTagged;
                        let hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
                        let scoreRegenerated = Math.min(hoursDiff + stunTimes[tagged].value, 5);
                        stunTimes[tagged].value = Math.max(scoreRegenerated - 1, 0);
                        stunTimes[tagged].time = thisTimeTagged;
                        if (tagger === player) {
                            score += scoreRegenerated;
                        }
                    } else {
                        stunTimes[tagged] = {
                            value: 4,
                            time: thisTimeTagged
                        };
                        if (tagger === player) {
                            score += 5;
                        }
                    }
                });
                finalScore += score;
                finishedParts++;
                return finish();
            }
            User.find({_id: {$in: reports.map(report => report.tagged)}})
                .select("_id playerName")
                .exec((err, users) => {
                    if (err) {
                        return cb({error: err});
                    }

                    let userMap = {}; //This is the store for player names for the descriptions
                    users.forEach(user => userMap[user._id] = user.playerName);

                    let score = 0;
                    let tagScore = 0;
                    let descriptions = [];
                    let tagdescriptions = [];
                    let stunTimes = {}; //This is the object that stores the last time a zombie was stunned (for point regeneration)
                    reports.forEach(report => {
                        let tagger = report.tagger.toString();
                        let tagged = report.tagged.toString();
                        let thisTimeTagged = report.time.getTime();
                        if (report.reportType === "Tag") {
                            if (tagger === player) {
                                tagScore += 5;
                                tagdescriptions.push("5 points for tagging " + userMap[tagged] + " on " + getDateString(report.time));
                            }
                            return;
                        }
                        if (tagged in stunTimes) {
                            let lastTimeTagged = stunTimes[tagged].time.getTime(); //This is in milliseconds since Unix Epoch (signed)
                            let timeDiff = thisTimeTagged - lastTimeTagged;
                            let hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
                            let scoreRegenerated = Math.min(hoursDiff + stunTimes[tagged].value, 5);
                            stunTimes[tagged].value = Math.max(scoreRegenerated - 1, 0);
                            stunTimes[tagged].time = thisTimeTagged;
                            if (tagger === player) {
                                score += scoreRegenerated;
                                let pointWord = "point"
                                if (scoreRegenerated !== 1) {
                                    pointWord += "s";
                                }
                                descriptions.push(scoreRegenerated + " " + pointWord + " for stunning " + userMap[tagged] + " on " + getDateString(report.time));
                            }
                        } else {
                            stunTimes[tagged] = {
                                value: 4,
                                time: thisTimeTagged
                            };
                            if (tagger === player) {
                                score += 5;
                                descriptions.push("5 points for stunning " + userMap[tagged] + " on " + getDateString(report.time));
                            }
                        }
                    });
                    reportScore = {tagScore, score, descriptions, tagdescriptions};
                    finish();
                });
        });
}

module.exports = FindUserScore;
