const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    tagger: {
        type: Schema.Types.ObjectId,
        required: true
    },
    tagged: {
        type: Schema.Types.ObjectId,
        required: true
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
    },
    gameId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    reportType: {
        type: String,
        required: true,
        enum: ["Tag", "Stun"]
    }
});

reportSchema.pre("validate", function (next) {
    if (this.taggerCode.toString() === this.taggedCode.toString()) {
        this.invalidate("taggedCode", "Cannot tag yourself");
    }
    next();
});

module.exports = mongoose.model("Report", reportSchema);
