const path = require("path");
const fs = require("fs");
const multiparty = require('multiparty');
const Promise = require('bluebird');

const attachmentStoreDirectory = path.resolve(__dirname, "../../../attachmentStore/");

function SaveAttachments(request) {
    return new Promise(function(resolve, reject) {
        var form = new multiparty.Form({uploadDir: attachmentStoreDirectory});
        let res = [];

        form.on('file', (name, file) => {
            res.push({
                fieldName: file.fieldName,
                filename: file.originalFilename,
                path: file.path
            });
        });

        form.on('error', error => {
            reject(error);
        });

        form.on('close', () => resolve(res));

        form.parse(request);
    });
}

module.exports = SaveAttachments;
