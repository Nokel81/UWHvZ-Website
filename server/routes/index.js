const fs = require("fs");
const path = require("path");

const ignoreFiles = [ "middleware", "index.js" ];
const middleRequirements = rootRequire("server/routes/middleware/index.json");

function defineRoutesTop(app, routePath) {
    fs.readdirSync(__dirname)
        .filter(file => ignoreFiles.indexOf(file) < 0)
        .forEach(file => {
            defineRoutes(app, path.join(__dirname, file), path.posix.join(routePath, file));
        });
}

function defineRoutes(app, dir, routePath) {
    let content = fs.readdirSync(dir);
    let directories = content.filter(file => fs.statSync(path.join(dir, file)).isDirectory());
    let files = content.filter(file => fs.statSync(path.join(dir, file)).isFile());

    directories.forEach(directory => defineRoutes(app, path.join(dir, directory), path.posix.join(routePath, directory)));

    if (files.length === 0) {
        return;
    }

    let route = app.route(routePath);
    (middleRequirements[dir] || [])
        .forEach(name => {
            let middleware = rootRequire(path.join("server/data-access/routes/middleware/", name));
            route.all(middleware());
        });
    files.forEach(file => {
        let method = path.basename(file, path.extname(file)).toLowerCase();
        let allowed = ["get", "head", "post", "put", "delete", "trace", "options", "connect", "patch"];
        if (allowed.indexOf(method) < 0) {
            return console.error("Invalid method name:" + method + "; in '" + dir + "'");
        }

        route[method](require(path.join(dir, file)));
    });
}

// Automatically setting up the server routes by the folder structure
module.exports = function (app) {
    defineRoutesTop(app, "/");
};
