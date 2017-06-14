const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sessionToken: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Session", sessionSchema);
