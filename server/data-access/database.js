const mongoose = require("mongoose");

const db = mongoose.connection;

function Init(config, cb) {
    mongoose.connect(config.dbIP, config.mongoose_options);
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
