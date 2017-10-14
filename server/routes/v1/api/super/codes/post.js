const regenerateCodes = rootRequire("server/data-access/functions/user/regenerateCodes");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    regenerateCodes()
        .then(message => {
            resolve(message);
        })
        .catch(error => {
            reject("Codes not regenerated: " + createErrorMessage(error));
        });
}

module.exports = Post;
