const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    gameId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    score: {
        type: Number,
        default: 0,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

module.exports = mongoose.model("Score", scoreSchema);
