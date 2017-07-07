const path = require("path");
const fs = require("fs");
const multiparty = require('multiparty');

const attachmentStoreDirectory = path.resolve(__dirname, "../../../attachmentStore/");

function SaveAttachments(request, cb) {
    var form = new multiparty.Form({uploadDir: attachmentStoreDirectory});
    let res = [];

    form.on('file', (name, file) => {
        res.push({
            fieldName: file.fieldName,
            originalFilename: file.originalFilename,
            path: file.path
        });
    });

    form.on('error', error => {
        cb({error});
    });

    form.on('close', () => cb({body: res}));

    form.parse(request);
}

module.exports = SaveAttachments;
