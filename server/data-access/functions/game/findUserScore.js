const Promise = require("bluebird");

const Report = rootRequire("server/schemas/report");
const User = rootRequire("server/schemas/user");
const SupplyCode = rootRequire("server/schemas/supplyCode");
const findGameById = rootRequire("server/data-access/functions/game/findById");
const getDateString = rootRequire("server/helpers/getDateString");

function scoreFromReports(reports, userMap, player, game) {
    let stunScore = 0;
    let tagScore = 0;
    let stunDescriptions = [];
    let tagDescriptions = [];
    let stunTimes = {}; //This is the object that stores the last time a zombie was stunned (for point regeneration)
    reports.forEach(report => {
        report.time = new Date(report.time);
        let tagger = report.tagger.toString();
        let tagged = report.tagged.toString();
        let thisTimeTagged = report.time.getTime();
        console.error(Object.keys(game));
        let pointModification = game.pointModifications.find(pm => new Date(pm.start) <= report.time && report.time <= new Date(pm.end));
        console.log(pointModification);
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
                let scoreInvarient = scoreRegenerated;
                if (pointModification) {
                    scoreInvarient = scoreInvarient * pointModification.multiple + pointModification.offset;
                }
                stunScore += scoreInvarient;
                if (!userMap) {
                    return;
                }
                let pointWord = "point";
                if (scoreInvarient !== 1) {
                    pointWord += "s";
                }
                stunDescriptions.push(scoreInvarient + " " + pointWord + " for stunning " + userMap[tagged] + " on " + getDateString(report.time));
            }
        } else {
            stunTimes[tagged] = {
                value: 4,
                time: thisTimeTagged
            };
            if (tagger === player) {
                let scoreInvarient = 5;
                if (pointModification) {
                    scoreInvarient = scoreInvarient * pointModification.multiple + pointModification.offset;
                }
                stunScore += scoreInvarient;
                if (!userMap) {
                    return;
                }
                let pointWord = "point";
                if (scoreInvarient !== 1) {
                    pointWord += "s";
                }
                stunDescriptions.push(scoreInvarient + " " + pointWord +" for stunning " + userMap[tagged] + " on " + getDateString(report.time));
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

function FindUserScore(gameId, playerId, forTeamScore, game) {
    return new Promise(function(resolve, reject) {
        let findSupplyCodes = SupplyCode.find({
            forGame: gameId,
            usedBy: playerId
        }).exec();
        let findReports = Report.find({
            gameId,
            ratified: true
        }).sort("time").exec();
        let findGame = forTeamScore ? Promise.resolve(game) : findGameById(gameId);

        Promise.join(findSupplyCodes, findReports, findGame, (codes, reports, game) => {
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
                let scoreObj = scoreFromReports(reports, null, playerId.toString(), game);
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
                        let info = scoreFromReports(reports, userMap, playerId.toString(), game);
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
