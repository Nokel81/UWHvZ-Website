const fs = require("fs");
const path = require("path");
const Promise = require('bluebird');

const attachmentStoreDirectory = path.resolve(__dirname, "../../../attachmentStore/");

function resolveFileData(fileData) {
    return new Promise(function(resolve, reject) {
        if (!Array.isArray(fileData)) {
            fileData = [];
        }

        fileData.every(data => {
            if (!data.fieldName || !data.filename || !data.path) {
                reject("Missing file data");
                return false;
            }
            data.path = path.basename(data.path);
            if (!fs.existsSync(path.join(attachmentStoreDirectory, data.path))) {
                reject("File path name does not exist");
                return false;
            }
            data.path = path.join(attachmentStoreDirectory, data.path);
            return true;
        });

        resolve(fileData);
    });
}

module.exports = resolveFileData;
