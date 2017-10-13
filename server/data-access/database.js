const Promise = require("bluebird");

const mongoose = require("mongoose");
mongoose.Promise = Promise;

const db = mongoose.connection;

function Init(config) {
    console.log("Connecting to database");
    return new Promise(function(resolve, reject) {
        mongoose.connect(config.dbIP, config.mongoose_options);
        mongoose.set("debug", config.debug);
        db.on("error", def => {
            reject(def);
        });
        db.on("open", () => {
            resolve("Connected to the database");
        });
    });
}

module.exports = {
    init: Init
};
