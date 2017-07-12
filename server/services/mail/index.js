const send = require("nodemailer");
const resolve = require("html_resolve");
const fs = require('fs');

const getDateString = rootRequire("server/helpers/getDateString");
const relativeResolve = resolve.relative(__dirname);

const transporter = new send.createTransport({
    host: 'mail.csclub.uwaterloo.ca',
    port: 587,
    secure: false,
    auth: {
         user: 'snmalton',
         pass: '9Y7Fm59y0W3qWx'
    }
});

const SERVICE = {};

SERVICE.sendConfirmationEmail = function (userObj, confirmationLink, cb) {
    const resolveData = {
        name: userObj.playerName,
        link: confirmationLink,
        code: userObj.playerCode
    };
    const html = relativeResolve("./emails/confirmation.html", resolveData);
    const mailOptions = {
        from: '"UW Humans vs Zombies" snmalton@csclub.uwaterloo.ca', // sender address,
        replyTo: 'uwhumansvszombies@gmail.com',
        to: userObj.email,
        subject: "Confirm Registration",
        html: html
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return cb("Email not sent");
        }
        cb(null, "Confirmation email has been sent");
    });
};

SERVICE.sendPasswordResetEmail = function (userObj, confirmationLink, cb) {
    const resolveData = {
        name: userObj.playerName,
        link: confirmationLink
    };
    const html = relativeResolve("./emails/passwordReset.html", resolveData);
    const mailOptions = {
        from: '"UW Humans vs Zombies" snmalton@csclub.uwaterloo.ca', // sender address
        replyTo: 'uwhumansvszombies@gmail.com',
        to: userObj.email,
        subject: "Password Reset Link",
        html: html
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return cb("Email not sent");
        }
        cb(null, "Password reset email has been sent");
    });
};

SERVICE.sendMessage = function (message, cb) {
    const mailOptions = {
        from: '"UW Humans vs Zombies" snmalton@csclub.uwaterloo.ca', // sender address
        replyTo: 'uwhumansvszombies@gmail.com',
        subject: message.subject,
        html: message.body,
        attachments: message.fileData
    };
    if (Array.isArray(message.to)) {
        if (message.to.length === 0) {
            message.fileData.forEach(fileData => {
                fs.unlink(fileData.path);
            });
            return cb("Email not sent, no one to send to");
        }
        let count = 0;
        message.to.forEach((to, index, tos) => {
            let email = JSON.parse(JSON.stringify(mailOptions));
            email.to = to;
            transporter.sendMail(email, (error, info) => {
                if (error) {
                    console.error(error);
                    return cb("Email not sent");
                }
                count++;
                if (count === tos.length) {
                    cb(null, "Message sent");
                    message.fileData.forEach(fileData => {
                        fs.unlink(fileData.path);
                    });
                }
            });
        });
    } else {
        mailOptions.to = message.to;
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return cb("Email not sent");
            }
            cb(null, "Message sent");
            message.fileData.forEach(fileData => {
                fs.unlink(fileData.path);
            });
        });
    }
};

SERVICE.sendTaggedEmail = function (toEmail, toName, fromName, report, cb) {
    let word = report.reportType.toLowerCase();
    word += word[word.length - 1];
    const resolveData = {
        toName,
        reportType: word,
        fromName,
        reportTime: getDateString(report.time),
        isZombieText: report.reportType === "Tag" ? " and thus you have become a zombie, your status on the website has been updated accordingly" : "",
        reportDescription: report.description,
        reportLocation: report.location
    };
    const html = relativeResolve("./emails/tagged.html", resolveData);
    const mailOptions = {
        from: '"UW Humans vs Zombies" snmalton@csclub.uwaterloo.ca', // sender address
        replyTo: 'uwhumansvszombies@gmail.com',
        subject: "You have been " + word + "ed",
        to: toEmail,
        html: html
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return cb("Email not sent");
        }
        cb(null, "Message sent");
    });
};

SERVICE.sendTaggerEmail = function (email, taggedName, report, cb) {
    const resolveData = {
        taggedName,
        tagTime: getDateString(report.time)
    }
    const html = relativeResolve("./emails/tagger.html", resolveData);
    const mailOptions = {
        from: '"UW Humans vs Zombies" snmalton@csclub.uwaterloo.ca', // sender address
        replyTo: 'uwhumansvszombies@gmail.com',
        subject: "You have been tagged",
        to: email,
        html: html
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return cb("Email not sent");
        }
        cb(null, "Message sent");
    });
};

SERVICE.sendStartingEmail = function (toList, game, HTMLlore, team, fileData, cb) {
    const resolveData = {
        suppliedValue: game.suppliedValue,
        railPassValue: game.railPassValue,
        minorPassValue: game.minorPassValue,
        majorPassValue: game.majorPassValue,
        officerValue: game.officerValue,
        HTMLlore
    };
    const html = relativeResolve("./emails/" + team + "Start.html", resolveData);
    const mailOptions = {
        from: '"UW Humans vs Zombies" snmalton@csclub.uwaterloo.ca', // sender address
        replyTo: 'uwhumansvszombies@gmail.com',
        subject: "Welcome to the game",
        html: HTMLlore,
        attachments: fileData
    };
    if (team === "zombie") {
        let email = JSON.parse(JSON.stringify(mailOptions));
        email.to = toList;
        transporter.sendMail(email, (error, info) => {
            if (error) {
                console.error(error);
                return cb("Email not sent");
            }
            cb(null, "Message sent");
        });
    } else {
        let count = 0;
        toList.forEach((to, index, tos) => {
            let email = JSON.parse(JSON.stringify(mailOptions));
            email.to = to;
            transporter.sendMail(email, (error, info) => {
                if (error) {
                    console.error(error);
                    return cb("Email not sent");
                }
                count++;
                if (count === tos.length) {
                    cb(null, "Message sent");
                }
            });
        });
    }
};

module.exports = SERVICE;
