const mongoose = require("mongoose");

const errorNotFound = rootRequire("server/schemas/plugins/errorNotFound");
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
errorNotFound(sessionSchema);

module.exports = mongoose.model("Session", sessionSchema);
