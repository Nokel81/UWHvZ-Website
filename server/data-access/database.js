const mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

const db = mongoose.connection;

function Init(config, cb) {
    mongoose.connect(config.dbIP, config.mongoose_options);
    mongoose.set('debug', config.debug);
    db.on("error", def => {
        cb({error: def});
    });
    db.on("open", () => {
        cb({sucess: "Connected to the database"});
    });
}

module.exports = {
    init: Init
};
