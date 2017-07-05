const send = require("gmail-send");
const resolve = require("html_resolve");
const credentials = require("./client_secret.json");

const relativeResolve = resolve.relative(__dirname);

const SERVICE = {};

SERVICE.sendConfirmationEmail = function (userObj, confirmationLink, cb) {
    const resolveData = {
        name: userObj.playerName,
        link: confirmationLink,
        code: userObj.playerCode
    };
    send({
        user: credentials.gmail_email,
        pass: credentials.gmail_password,
        to: userObj.email,
        subject: "Confirm Registration",
        html: relativeResolve("./emails/confirmation.html", resolveData)
    })({}, cb);
};

module.exports = SERVICE;
