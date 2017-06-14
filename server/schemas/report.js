const mongoose = require("mongoose");

const ValidCode = rootRequire("server/schemas/validators/validCode");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    taggerCode: {
        type: String,
        required: true,
        validate: ValidCode
    },
    taggedCode: {
        type: String,
        required: true,
        validate: ValidCode
    },
    time: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    },
    decription: {
        type: String,
        required: true,
        minlength: 25
    }
});

reportSchema.pre("validate", function (next) {
    if (this.taggerCode === this.taggedCode) {
        this.invalidate("taggedCode", "Cannot tag yourself");
    }
    next();
});

module.exports = mongoose.model("Report", reportSchema);
