const deleteReport = rootRequire("server/data-access/functions/report/deleteReport");

function Delete(req, res, next) {
    const reportId = req.query.reportId;
    const gameId = req.query.gameId;
    deleteReport(reportId, gameId, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            if (result.error.errors) {
                const errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
                res.status(400).send("Report not made: " + errors);
            } else {
                res.status(400).send("Report not made: " + result.error);
            }
        } else {
            res.status(201).send(result.body);
        }
    });
}

module.exports = Delete;
