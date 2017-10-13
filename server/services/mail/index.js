const Promise = require('bluebird');
const nodemailer = require("nodemailer");
const resolve = require("html_resolve");
const fs = require('fs');

const getDateString = rootRequire("server/helpers/getDateString");
const clone = rootRequire("server/helpers/clone");
const relativeResolve = resolve.relative(__dirname);

const sendMail = Promise.promisifyAll(new nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
}));

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

        sendMail.sendMail(mailOptions)
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
        if (!user) {
            console.error("user email is not a valid email");
            return resolve("Password reset email has been sent");
        }
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

        sendMail.sendMail(mailOptions)
        .then(info => {
            resolve("Password reset email has been sent");
        })
        .catch(error => {
            console.error(error);
            reject("Error sending message");
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
            return sendMail.sendMail(option);
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

        sendMail.sendMail(mailOptions)
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
