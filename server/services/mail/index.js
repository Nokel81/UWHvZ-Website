const send = require("nodemailer");
const resolve = require("html_resolve");
const fs = require('fs');

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
        text: message.body,
        files: message.fileData.map(fileData => fileData.path)
    };
    if (Array.isArray(message.to)) {
        mailOptions.to = 'uwhumansvszombies@gmail.com';
        mailOptions.bcc = message.to;
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
    } else {
        mailOptions.to = message.to;transporter.sendMail(mailOptions, (error, info) => {
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

module.exports = SERVICE;
