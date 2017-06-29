const browserify = require("browserify");
const fs = require("fs");
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const bulkify = require("bulkify");
const ngAnnotate = require("browserify-ngannotate");
const debowerify = require("debowerify");

global.rootRequire = function (name) {
    return require(path.join(__dirname, name));
};

const routes = rootRequire("server/routes");
const database = rootRequire("server/data-access/database");
const config = rootRequire("server/config.json");

var initialize = true;

//Setting up the dist folder
if (!fs.existsSync("./app/dist/")) {
    fs.mkdirSync("./app/dist/");
}

console.log("browserifying...");
var bundler = browserify("./app/js/app.js");

bundler
    .transform("babelify", { presets: ["es2015"] })
    .transform(debowerify, {})
    .transform(ngAnnotate, {})
    .transform("brfs", {})
    .transform(bulkify, {})
    // .transform("uglifyify", { global: true })
    .bundle()
    .pipe(fs.createWriteStream("./app/dist/app.js"));
bundler
    .pipeline
    .get("wrap")
    .on('end', function () {
        // Setting up the server

        // const credentials = {
        //     key: fs.readFileSync("./ssl-key/key.pem", "utf8"),
        //     cert: fs.readFileSync("./ssl-key/cert.pem", "utf8")
        // };
        const app = express();

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(morgan("dev"));

        app.use(express.static("./app"));
        routes(app);
        app.use(function (req, res) {
            res.sendFile(__dirname + "/app/index.html");
        });

        database.init(config, res => {
            if (res.error) {
                console.log(res.error.message);
                return;
            }
            console.log(res.sucess);

            // TODO: Activate SSL, but don't bother with it yet
            // var httpsServer = https.createServer(credentials, app);
            // httpsServer.listen(config.port, function () {
            //     console.log("Listening on port: " + config.port);
            // });

            if (!initialize) {
                return;
            }
            const listener = app.listen(config, () => {
                console.log("Listening on port: " + listener.address().port);
                initialize = false;
            });
        });
    });
