const Promise = require('bluebird');

const Report = rootRequire("server/schemas/report");
const findByGame = rootRequire("server/data-access/functions/report/findByGame");

function Ratify(reportId, gameId) {
    return new Promise(function(resolve, reject) {
        Report.findOneAndUpdate({_id: reportId}, {$set: {ratified: true}})
        .exec()
        .then(report => {
            return findByGame(gameId, false);
        })
        .then(reports => {
            resolve(reports);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = Ratify;
