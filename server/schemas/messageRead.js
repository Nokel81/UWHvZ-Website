const mongoose = require("mongoose");

const errorNotFound = rootRequire("server/schemas/plugins/errorNotFound");
const ValidCode = rootRequire("server/schemas/validators/validCode");
const Schema = mongoose.Schema;

const messageReadSchema = new Schema({
    messageId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    usercode: {
        type: String,
        required: true,
        validator: ValidCode
    },
    isRead: {
        type: Boolean,
        required: true
    }
});
errorNotFound(messageReadSchema);

module.exports = mongoose.model("MessageRead", messageReadSchema);
