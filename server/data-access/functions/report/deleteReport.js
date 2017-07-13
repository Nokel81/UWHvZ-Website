const Report = rootRequire("server/schemas/report");
const findByGame = rootRequire("server/data-access/functions/report/findByGame");

function DeleteReport(reportId, gameId, cb) {
    Report.remove({_id: reportId})
        .exec((err, report) => {
            if (err) {
                return cb({error: err});
            }
            findByGame(gameId, false, cb);
        });
}

module.exports = DeleteReport;
