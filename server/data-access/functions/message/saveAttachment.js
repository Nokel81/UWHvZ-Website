const path = require("path");
const fs = require("fs");
const multiparty = require('multiparty');

const attachmentStoreDirectory = path.resolve(__dirname, "../../../attachmentStore/");

function SaveAttachments(request, cb) {
    var form = new multiparty.Form({uploadDir: attachmentStoreDirectory});

    form.on('file', (name, file) => {
        console.log(name);
        console.log(file);
        cb({body: "All good"});
    });

    form.on('error', error => {
        cb({error});
    });

    form.on('progress', (byteRecieved, byteExpected) => {
        console.log(byteRecieved + " : " + byteExpected);
    });

    form.on('close', () => {
        cb({body: "All good"});
    });

    console.log("parsing");
    form.parse(request);
}

module.exports = SaveAttachments;
