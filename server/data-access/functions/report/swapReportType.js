const Promise = require("bluebird");

const Report = rootRequire("server/schemas/report");
const findByGame = rootRequire("server/data-access/functions/report/findByGame");

function SwapReportType(reportId, gameId) {
    return new Promise(function(resolve, reject) {
        Report.findOne({
            _id: reportId
        })
            .exec()
            .then(report => {
                report.reportType = report.reportType === "Tag" ? "Stun" : "Tag";
                return report.save();
            })
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

module.exports = SwapReportType;
