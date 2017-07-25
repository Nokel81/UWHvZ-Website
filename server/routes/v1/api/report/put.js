const ratify = rootRequire("server/data-access/functions/report/ratify");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, res, next) {
    const {reportId, gameId} = req.body;
    ratify(reportId, gameId)
    .then(reports => {
        res.status(201).json(reports);
    })
    .catch(error => {
        res.status(400).send("Event report not removed: " + createErrorMessage(error));
    });
}

module.exports = Put;
