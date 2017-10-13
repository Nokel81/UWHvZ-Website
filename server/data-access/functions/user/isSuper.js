const Promise = require("bluebird");

const findById = rootRequire("server/data-access/functions/user/findById");
const config = rootRequire("server/config.json");

function IsSuper(userId) {
    return new Promise(function(resolve, reject) {
        findById(userId)
            .then(user => {
                resolve(user.email === config.webmasterEmail);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = IsSuper;
