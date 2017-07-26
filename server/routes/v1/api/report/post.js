const create = rootRequire("server/data-access/functions/report/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const report = req.body;
    create(report)
    .then(message => {
        resolve(message);
    })
    .catch(error => {
        reject("Event report not made: " + createErrorMessage(error));
    });
}

module.exports = Post;
