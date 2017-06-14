const send = require("gmail-send");
const resolve = require("html_resolve");

const credentials = require("./client_secret.json");
const relative_resolve = resolve.relative(__dirname);

const SERVICE = {};

SERVICE.sendConfirmationEmail = function(userObj, confirmationLink) {
    let resolve_data = {
        name: userObj.playerName,
        link: confirmationLink,
        code: userObj.playerCode
    };
    send({
        user: credentials.gmail_email,
        pass: credentials.gmail_password,
        to: userObj.email,
        subject: "Confirm Registration",
        html: relative_resolve("./emails/confirmation.html", resolve_data)
    })();
};

module.exports = SERVICE;
