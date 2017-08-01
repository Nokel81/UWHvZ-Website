const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const bulkify = require("bulkify");
const browserify = require("browserify");
const debowerify = require("debowerify");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ngAnnotate = require("browserify-ngannotate");

global.rootRequire = function (name) {
    return require(path.join(__dirname, name));
};

const routes = rootRequire("server/routes");
const database = rootRequire("server/data-access/database");
const config = rootRequire("server/config.json");

if (process.argv[2] === "dev") {
    config.dbIP = "mongodb://localhost:27017/test";
}

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
        app.use(cookieParser());
        app.use(morgan("dev"));
        app.use(rootRequire('server/routes/middleware/addUserInfo'));

        routes(app);
        app.use(express.static(path.join(__dirname, "./app")));
        app.use((req, res) => {
            res.sendFile(path.join(__dirname, "./app/index.html"));
        });

        database.init(config)
        .then(message => {
            console.log(message);

            if (!initialize) {
                return;
            }
            const listener = app.listen(config, () => {
                console.log("Listening on port: " + listener.address().port);
                initialize = false;
            });
        })
        .catch(error => {
            console.error(error);
        });
    });
