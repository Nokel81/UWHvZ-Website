const ratify = rootRequire("server/data-access/functions/report/ratify");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, resolve, reject) {
    const {
        reportId,
        gameId
    } = req.body;
    ratify(reportId, gameId)
        .then(reports => {
            resolve(reports);
        })
        .catch(error => {
            reject("Event report not removed: " + createErrorMessage(error));
        });
}

module.exports = Put;
