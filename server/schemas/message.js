const mongoose = require("mongoose");

const ValidCode = rootRequire("server/schemas/validators/validCode");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: {
        type: String,
        required: true,
        validate: ValidCode
    },
    fromCode: {
        type: String,
        required: true,
        validate: ValidCode
    },
    to: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Message", messageSchema);
