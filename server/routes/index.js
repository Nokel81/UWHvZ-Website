const fs = require("fs");
const path = require("path");

const ignoreFiles = ["middleware", "index.js"];
const middlewareFile = "_middleware.json";

const successCodes = {
    get: 200,
    post: 201,
    put: 202,
    delete: 200
};
const failCodes = {
    get: 404,
    post: 400,
    put: 400,
    delete: 404
};

function defineRoutesTop(app, routePath) {
    fs.readdirSync(__dirname)
        .filter(file => ignoreFiles.indexOf(file) < 0)
        .forEach(file => {
            defineRoutes(app, path.join(__dirname, file), path.posix.join(routePath, file));
        });
}

function defineRoutes(app, dir, routePath) {
    const content = fs.readdirSync(dir);
    const directories = content.filter(file => fs.statSync(path.join(dir, file)).isDirectory());
    const files = content.filter(file => fs.statSync(path.join(dir, file)).isFile());
    const route = app.route(routePath);
    let middleware = [];
    if (files.includes(middlewareFile)) {
        middleware = require(path.join(dir, middlewareFile));
        files.splice(files.indexOf(middlewareFile), 1);
    }

    directories.forEach(directory => defineRoutes(app, path.join(dir, directory), path.posix.join(routePath, directory)));

    files.forEach(file => {
        const method = path.basename(file, path.extname(file)).toLowerCase();
        const allowed = ["get", "post", "put", "delete"];
        if (allowed.indexOf(method) < 0) {
            return console.error("Invalid method name:" + method + "; in '" + dir + "'");
        }
        middleware.forEach(name => {
            app.use(routePath, rootRequire('server/routes/middleware/' + name));
        });
        route[method](function (req, res) {
            let resolve = function (item) {
                res.status(successCodes[method]).json(item);
            };
            let reject = function (message) {
                res.status(failCodes[method]).send(message);
            };
            require(path.join(dir, file))(req, resolve, reject);
        });
    });
}

// Automatically setting up the server routes by the folder structure
module.exports = function (app) {
    console.log("Defining Routes...");
    defineRoutesTop(app, "/");
};
