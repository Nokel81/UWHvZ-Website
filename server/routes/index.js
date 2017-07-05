const fs = require("fs");
const path = require("path");

const ignoreFiles = ["middleware", "index.js"];
const middleRequirements = rootRequire("server/routes/middleware/index.json");

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

    directories.forEach(directory => defineRoutes(app, path.join(dir, directory), path.posix.join(routePath, directory)));

    if (files.length === 0) {
        return;
    }
    const route = app.route(routePath.replace(/_/g, "/:"));
    // (middleRequirements[routePath] || [])
    //     .forEach(name => {
    //         console.log(name);
    //         let middleware = rootRequire(path.join("server/routes/middleware/", name));
    //         route.all(middleware());
    //     });
    files.forEach(file => {
        const method = path.basename(file, path.extname(file)).toLowerCase().split("_");
        const allowed = ["get", "head", "post", "put", "delete", "trace", "options", "connect", "patch"];
        if (allowed.indexOf(method[0]) < 0) {
            return console.error("Invalid method name:" + method + "; in '" + dir + "'");
        }

        route[method](require(path.join(dir, file)));
    });
}

// Automatically setting up the server routes by the folder structure
module.exports = function (app) {
    console.log("Defining Routes...");
    defineRoutesTop(app, "/");
};
