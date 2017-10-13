const Promise = require("bluebird");

const Report = rootRequire("server/schemas/report");
const findByGame = rootRequire("server/data-access/functions/report/findByGame");

function Ratify(reportId, gameId) {
    return new Promise(function(resolve, reject) {
        Report.updateOne({
            _id: reportId
        }, {
            $set: {
                ratified: true
            }
        })
            .exec()
            .then(() => {
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
