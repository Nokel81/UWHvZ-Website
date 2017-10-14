const deleteUnused = rootRequire("server/data-access/functions/supplyCode/deleteUnused");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    deleteUnused()
        .then(message => {
            resolve(message);
        })
        .catch(error => {
            reject("Supply Codes not deleted: " + createErrorMessage(error));
        });
}

module.exports = Post;
