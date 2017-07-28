const Promise = require('bluebird');

const Report = rootRequire("server/schemas/report");
const findByGame = rootRequire("server/data-access/functions/report/findByGame");

function DeleteReport(reportId, gameId) {
    return new Promise(function(resolve, reject) {
        Report.remove({_id: reportId})
        .exec()
        .then(report => {
            return findByGame(gameId, false);
        })
        .then(game => {
            resolve(game);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = DeleteReport;
