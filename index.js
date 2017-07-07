const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bulkify = require("bulkify");
const browserify = require("browserify");
const debowerify = require("debowerify");
const bodyParser = require("body-parser");
const ngAnnotate = require("browserify-ngannotate");

global.rootRequire = function (name) {
    return require(path.join(__dirname, name));
};

const routes = rootRequire("server/routes");
const database = rootRequire("server/data-access/database");
const config = rootRequire("server/config.json");

let initialize = true;

// Setting up the dist folder
if (!fs.existsSync(path.join(__dirname, "./app/dist/"))) {
    fs.mkdirSync(path.join(__dirname, "./app/dist/"));
}

console.log("browserifying...");
const bundler = browserify(path.join(__dirname, "./app/js/app.js"));

bundler
    .transform("babelify", {presets: ["es2015"]})
    .transform(debowerify, {})
    .transform(ngAnnotate, {})
    .transform("brfs", {})
    .transform(bulkify, {})
    // .transform("uglifyify", { global: true })
    .bundle()
    .pipe(fs.createWriteStream(path.join(__dirname, "./app/dist/app.js")));
bundler
    .pipeline
    .get("wrap")
    .on("end", () => {
        // Setting up the server

        const app = express();

        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(morgan("dev"));

        app.use(express.static(path.join(__dirname, "./app")));
        routes(app);
        app.use((req, res) => {
            res.sendFile(path.join(__dirname, "./app/index.html"));
        });

        database.init(config, res => {
            if (res.error) {
                console.log(res.error.message);
                return;
            }
            console.log(res.sucess);

            if (!initialize) {
                return;
            }
            const listener = app.listen(config, () => {
                console.log("Listening on port: " + listener.address().port);
                initialize = false;
            });
        });
    });
