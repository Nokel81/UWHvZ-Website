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
    description: {
        type: String,
        required: true,
        minlength: [25, "The description has been at least 25 characters long"]
    },
    gameId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    reportType: {
        type: String,
        required: true,
        enum: ["Tag", "Stun"]
    },
    ratified: {
        type: Boolean,
        default: false
    }
});

reportSchema.pre("validate", function (next) {
    if (this.tagger.toString() === this.tagged.toString()) {
        this.invalidate("taggedCode", "Cannot tag yourself");
    }
    if (this.reportType === "Tag") {
        this.ratified = true;
    }
    next();
});

module.exports = mongoose.model("Report", reportSchema);
