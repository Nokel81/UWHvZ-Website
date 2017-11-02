const swapReportType = rootRequire("server/data-access/functions/report/swapReportType");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, resolve, reject) {
    const {
        reportId,
        gameId
    } = req.body;
    swapReportType(reportId, gameId)
        .then(reports => {
            resolve(reports);
        })
        .catch(error => {
            reject("Event report not removed: " + createErrorMessage(error));
        });
}

module.exports = Put;
