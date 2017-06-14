const mongoose = require("mongoose");

const db = mongoose.connection;

const init = function (config, cb) {
    mongoose.connect(config.dbIP);
    db.on("error", def => {
        cb({error: def});
    });
    db.on("open", () => {
        cb({sucess: "Connected to the database"});
    });
};

module.exports = {
    init
};
