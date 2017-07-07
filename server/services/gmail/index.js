const send = require("gmail-send");
const resolve = require("html_resolve");
const credentials = require("./client_secret.json");
const fs = require('fs');

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

SERVICE.sendPasswordResetEmail = function (userObj, confirmationLink, cb) {
    const resolveData = {
        name: userObj.playerName,
        link: confirmationLink
    };
    send({
        user: credentials.gmail_email,
        pass: credentials.gmail_password,
        to: userObj.email,
        subject: "Password Reset Link",
        html: relativeResolve("./emails/passwordReset.html", resolveData)
    })({}, cb);
};

SERVICE.sendMessage = function (message, cb) {
    if (Array.isArray(message.to)) {
        let count = 0;
        message.to.forEach(email => {
            send({
                user: credentials.gmail_email,
                pass: credentials.gmail_password,
                to: email,
                subject: message.subject,
                text: message.body,
                files: message.fileData.map(fileData => fileData.path)
            })({}, (err, res) => {
                if (err) {
                    return cb({error: err});
                }
                count++;
                if (count === message.to.length) {
                    cb({body: "Message sent"});
                    message.fileData.forEach(fileData => {
                        fs.unlink(fileData.path);
                    });
                }
            });
        });
    } else {
        send({
            user: credentials.gmail_email,
            pass: credentials.gmail_password,
            to: message.to,
            subject: message.subject,
            text: message.body,
            files: message.fileData.map(fileData => fileData.path)
        })({}, (err, res) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: "Message sent"});
            message.fileData.forEach(fileData => {
                fs.unlink(fileData.path);
            });
        });
    }
};

module.exports = SERVICE;
