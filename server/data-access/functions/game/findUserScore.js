const Promise = require("bluebird");

const Report = rootRequire("server/schemas/report");
const User = rootRequire("server/schemas/user");
const SupplyCode = rootRequire("server/schemas/supplyCode");
const getDateString = rootRequire("server/helpers/getDateString");

function scoreFromReports(reports, userMap, player) {
    let stunScore = 0;
    let tagScore = 0;
    let stunDescriptions = [];
    let tagDescriptions = [];
    let stunTimes = {}; //This is the object that stores the last time a zombie was stunned (for point regeneration)
    console.log(reports);
    console.log(player);
    reports.forEach(report => {
        report.time = new Date(report.time);
        let tagger = report.tagger.toString();
        let tagged = report.tagged.toString();
        let thisTimeTagged = report.time.getTime();
        if (report.reportType === "Tag") {
            if (tagger === player) {
                tagScore += 5;
                if (!userMap) {
                    return;
                }
                tagDescriptions.push("5 points for tagging " + userMap[tagged] + " on " + getDateString(report.time));
            }
            return;
        }
        if (tagged in stunTimes) {
            let lastTimeTagged = stunTimes[tagged].time; //This is in milliseconds since Unix Epoch (signed)
            let timeDiff = thisTimeTagged - lastTimeTagged;
            let hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
            let scoreRegenerated = Math.min(hoursDiff + stunTimes[tagged].value, 5);
            stunTimes[tagged].value = Math.max(scoreRegenerated - 1, 0);
            stunTimes[tagged].time = thisTimeTagged;
            if (tagger === player) {
                stunScore += scoreRegenerated;
                if (!userMap) {
                    return;
                }
                let pointWord = "point";
                if (scoreRegenerated !== 1) {
                    pointWord += "s";
                }
                stunDescriptions.push(scoreRegenerated + " " + pointWord + " for stunning " + userMap[tagged] + " on " + getDateString(report.time));
            }
        } else {
            stunTimes[tagged] = {
                value: 4,
                time: thisTimeTagged
            };
            if (tagger === player) {
                stunScore += 5;
                if (!userMap) {
                    return;
                }
                stunDescriptions.push("5 points for stunning " + userMap[tagged] + " on " + getDateString(report.time));
            }
        }
    });
    return {
        stunScore,
        tagScore,
        stunDescriptions,
        tagDescriptions
    };
}

function FindUserScore(gameId, playerId, forTeamScore) {
    return new Promise(function(resolve, reject) {
        let findSupplyCodes = SupplyCode.find({
            forGame: gameId,
            usedBy: playerId
        }).exec();
        let findReports = Report.find({
            gameId,
            ratified: true
        }).sort("time").exec();

        Promise.join(findSupplyCodes, findReports, (codes, reports) => {
            let finalScore = 0;
            let codeScore = 0;
            let codeCount = {};
            codes.forEach(code => {
                codeScore += code.value;
                if (forTeamScore) {
                    return;
                }
                let valString = code.value.toString();
                if (valString in codeCount) {
                    codeCount[valString]++;
                } else {
                    codeCount[valString] = 1;
                }
            });
            let codeDescriptions = Object.keys(codeCount)
                .sort((a, b) => a - b)
                .map(codeValue => codeCount[codeValue] + " supply code" + (codeCount[codeValue] > 1 ? "s" : "") + " worth " + codeValue + " points");
            finalScore += codeScore;

            if (forTeamScore) {
                let scoreObj = scoreFromReports(reports, null, playerId.toString());
                finalScore += scoreObj.stunScore + scoreObj.tagScore;
                resolve(finalScore);
            } else {
                User.find({
                    _id: {
                        $in: reports.map(report => report.tagged)
                    }
                })
                    .select("_id playerName")
                    .exec()
                    .then(users => {
                        let userMap = {}; //This is the store for player names for the descriptions
                        users.forEach(user => userMap[user._id] = user.playerName);
                        let info = scoreFromReports(reports, userMap, playerId.toString());
                        info.codeScore = codeScore;
                        info.codeDescriptions = codeDescriptions;
                        resolve(info);
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindUserScore;
