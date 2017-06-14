const mongoose = require("mongoose");

const minLength = rootRequire("server/schemas/validators/setMinLength");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    signUpDates: {
        type: [Date],
        required: true,
        validate: minLength("signUpDates", 1)
    },
    signUpLocations: {
        type: [String],
        required: true,
        validate: minLength("signUpLocations", 1)
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    moderators: {
        type: [Schema.Types.ObjectId],
        required: true,
        validate: minLength("signUpLocations", 1)
    },
    zombies: {
        type: [Schema.Types.ObjectId],
        required: true
    },
    humans: {
        type: [Schema.Types.ObjectId],
        required: true
    },
    suppliedValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        required: true,
        default: 5
    },
    railPassValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        required: true,
        default: 25
    },
    minorPassValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        required: true,
        default: 50
    },
    majorPassValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        required: true,
        default: 100
    },
    officerValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        required: true,
        default: 200
    }
});

module.exports = mongoose.model("Game", gameSchema);
