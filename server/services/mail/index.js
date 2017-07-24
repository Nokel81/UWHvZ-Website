const Promise = require('bluebird');
Promise.promisifyAll(require("nodemailer"));
const nodemailer = require("nodemailer");
const resolve = require("html_resolve");
const fs = require('fs');

const getDateString = rootRequire("server/helpers/getDateString");
const relativeResolve = resolve.relative(__dirname);

const sendMail = new nodemailer.createTransport({
    host: 'mail.csclub.uwaterloo.ca',
    port: 587,
    secure: false,
    auth: {
         user: 'hvz',
         pass: '9Y7Fm59y0W3qWx'
    }
}).sendMailAsync;

const SERVICE = {};

SERVICE.sendConfirmationEmail = function (user) {
    return new Promise(function(resolve, reject) {
        const resolveData = {
            name: user.playerName,
            link: "https://uwhvz.uwaterloo.ca/user?token=" + user.confirmationToken,
            code: user.playerCode
        };
        const html = relativeResolve("./emails/confirmation.html", resolveData);
        const mailOptions = {
            from: '"UW Humans vs Zombies" hvz@csclub.uwaterloo.ca', // sender address,
            replyTo: 'uwhumansvszombies@gmail.com',
            to: user.email,
            subject: "Confirm Registration",
            html: html
        };

        sendMail(mailOptions)
        .then(info => {
            resolve("Confirmation email has been sent");
        })
        .catch(error => {
            console.error(error);
            reject("Email not sent");
        });
    });
};

SERVICE.sendPasswordResetEmail = function (user) {
    return new Promise(function(resolve, reject) {
        const resolveData = {
            name: user.playerName,
            link: "https://uwhvz.uwaterloo.ca/passwordReset?code=" + user.passwordResetCode
        };
        const html = relativeResolve("./emails/passwordReset.html", resolveData);
        const mailOptions = {
            from: '"UW Humans vs Zombies" hvz@csclub.uwaterloo.ca', // sender address
            replyTo: 'uwhumansvszombies@gmail.com',
            to: user.email,
            subject: "Password Reset Link",
            html: html
        };

        sendMail(mailOptions)
        .then(info => {
            resolve("Password reset email has been sent");
        })
        .catch(error => {
            console.error(error);
            reject("Email not sent");
        });
    });
};

SERVICE.sendMessage = function (message) {
    return new Promise(function(resolve, reject) {
        const mailOptions = {
            from: '"UW Humans vs Zombies" hvz@csclub.uwaterloo.ca', // sender address
            replyTo: 'uwhumansvszombies@gmail.com',
            subject: message.subject,
            html: message.body,
            attachments: message.fileData
        };
        let recipients = message.to;
        if (!Array.isArray(recipients)) {
            recipients = [recipients];
        }
        recipients = recipients.map(recipient => {
            let option = clone(mailOptions);
            option.to = recipient;
            return sendMessage(option);
        });

        Promise.all(recipients)
        .then(noerror => {
            message.fileData.forEach(fileData => {
                fs.unlink(fileData.path);
            });
            resolve("Email sent");
        })
        .catch(error => {
            message.fileData.forEach(fileData => {
                fs.unlink(fileData.path);
            });
            console.error(error);
            reject("Email not sent");
        });
    });
};

SERVICE.sendTaggedEmail = function (toEmail, toName, fromName, report) {
    return new Promise(function(resolve, reject) {
        let reportWord = report.reportType.toLowerCase();
        reportWord += reportWord[reportWord.length - 1];
        const resolveData = {
            toName,
            reportWord,
            fromName,
            reportTime: getDateString(report.time),
            isZombieText: report.reportType === "Tag" ? " and thus you have become a zombie, your status on the website has been updated accordingly" : "",
            reportDescription: report.description,
            reportLocation: report.location
        };
        const html = relativeResolve("./emails/tagged.html", resolveData);
        const mailOptions = {
            from: '"UW Humans vs Zombies" hvz@csclub.uwaterloo.ca', // sender address
            replyTo: 'uwhumansvszombies@gmail.com',
            subject: "You have been " + reportWord + "ed",
            to: toEmail,
            html: html
        };

        sendMail(mailOptions)
        .then(info => {
            resolve("Email sent");
        })
        .catch(error => {
            console.error(error);
            reject("Email not sent");
        });
    });
};

SERVICE.sendStartingEmail = function (toList, game, HTMLlore, team, attachments, names = []) {
    return new Promise(function(resolve, reject) {
        const resolveData = clone(game);
        resolveData.HTMLlore = HTMLlore;
        resolveData.startingZombieNames = names.map(name => "<li>" + name + "</li>");
        const html = relativeResolve("./emails/" + team + "Start.html", resolveData);
        const mailOptions = {
            from: '"UW Humans vs Zombies" hvz@csclub.uwaterloo.ca', // sender address
            replyTo: 'uwhumansvszombies@gmail.com',
            subject: "Welcome to the game",
            html,
            attachments
        };
        toList = toList.map(recipient => {
            let option = clone(mailOptions);
            option.to = recipient;
            return sendMessage(option);
        });

        Promise.all(toList)
        .then(noerror => {
            resolve("Email sent");
        })
        .catch(error => {
            console.error(error);
            reject("Email not sent");
        });
    });
};

SERVICE.sendUnsuppliedEmail = function(toList, names, suppliedValue) {
    return new Promise(function(resolve, reject) {
        const resolveData = {
            suppliedValue,
            toName: names[index]
        };
        const html = relativeResolve("./emails/unsupplied.html", resolveData);
        const mailOptions = {
            from: '"UW Humans vs Zombies" hvz@csclub.uwaterloo.ca', // sender address
            replyTo: 'uwhumansvszombies@gmail.com',
            subject: "Unsupplied Zombification",
            html
        };
        toList = toList.map(recipient => {
            let option = clone(mailOptions);
            option.to = recipient;
            return sendMessage(option);
        });

        Promise.all(toList)
        .then(noerror => {
            resolve("Email sent");
        })
        .catch(error => {
            console.error(error);
            reject("Email not sent");
        });
    });
};

module.exports = SERVICE;
