const deleteReport = rootRequire("server/data-access/functions/report/deleteReport");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, res, next) {
    const {reportId, gameId} = req.query;
    deleteReport(reportId, gameId)
    .then(reports => {
        res.status(200).send(reports);
    })
    .catch(error => {
        res.status(400).send("Game report not deleted: " + createErrorMessage(error));
    });
}

module.exports = Delete;
