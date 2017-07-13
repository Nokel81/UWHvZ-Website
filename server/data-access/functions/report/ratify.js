const Report = rootRequire("server/schemas/report");
const findByGame = rootRequire("server/data-access/functions/report/findByGame");

function Ratify(reportId, gameId, cb) {
    Report.findOneAndUpdate({_id: reportId}, {
        $set: {
            ratified: true
        }
    }, (err, report) => {
        if (err) {
            return cb({error: err});
        }
        findByGame(gameId, false, cb);
    });
}

module.exports = Ratify;
