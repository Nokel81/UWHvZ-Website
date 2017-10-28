const Promise = require("bluebird");
const resolve = require("html_resolve");
const pdf = require("html-pdf");

const relativeResolve = resolve.relative(__dirname);

const SERVICE = {};

SERVICE.createPlayerCodeDocument = function (user) {
    return new Promise(function(resolve, reject) {
        const html = relativeResolve("./documents/playerCodePasses.html", user);
        const options = {
            format: "Letter"
        };

        pdf.create(html, options)
            .toBuffer((err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
    });
};

module.exports = SERVICE;
