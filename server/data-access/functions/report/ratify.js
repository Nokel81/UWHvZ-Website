const Report = rootRequire("server/schemas/report");
const findUnratified = rootRequire("server/data-access/functions/report/findUnratified");

function Ratify(reportId, gameId, cb) {
    Report.findOneAndUpdate({_id: reportId}, {
        $set: {
            ratified: true
        }
    }, (err, report) => {
        if (err) {
            return cb({error: err});
        }
        findUnratified(gameId, cb);
    });
}

module.exports = Ratify;
