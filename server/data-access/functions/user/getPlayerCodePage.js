const Promise = require("bluebird");

const findById = rootRequire("server/data-access/functions/user/findById");
const pdf = rootRequire("server/services/pdf");

function IsSuper(userId) {
    return new Promise(function(resolve, reject) {
        findById(userId)
            .then(user => {
                return pdf.createPlayerCodeDocument(user);
            })
            .then(buffer => {
                resolve(buffer);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = IsSuper;
