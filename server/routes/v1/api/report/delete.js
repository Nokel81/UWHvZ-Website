const deleteReport = rootRequire("server/data-access/functions/report/deleteReport");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, resolve, reject) {
    const {
        reportId,
        gameId
    } = req.query;
    deleteReport(reportId, gameId)
        .then(reports => {
            resolve(reports);
        })
        .catch(error => {
            reject("Game report not deleted: " + createErrorMessage(error));
        });
}

module.exports = Delete;
