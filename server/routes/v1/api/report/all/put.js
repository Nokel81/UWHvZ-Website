const ratifyAll = rootRequire("server/data-access/functions/report/ratifyAll");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, resolve, reject) {
    const {
        gameId
    } = req.body;
    ratifyAll(gameId)
        .then(reports => {
            resolve(reports);
        })
        .catch(error => {
            reject("Event report not removed: " + createErrorMessage(error));
        });
}

module.exports = Put;
