const mongoose = require("mongoose");

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
        required: true
    },
    signUpLocations: {
        type: [String],
        required: true
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
        type: [Schema.Types.ObjectId]
    },
    zombies: {
        type: [Schema.Types.ObjectId]
    },
    humans: {
        type: [Schema.Types.ObjectId]
    },
    spectators: {
        type: [Schema.Types.ObjectId]
    },
    suppliedValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        default: 5
    },
    railPassValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        default: 25
    },
    minorPassValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        default: 50
    },
    majorPassValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        default: 100
    },
    officerValue: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        default: 200
    }
});

gameSchema.pre("validate", function (next) {
    if (this.startDate >= this.endDate) {
        return this.invalidate("startDate", "Must be before game's end time");
    }

    for (let i = 0; i < this.signUpDates.length; i++) {
        if (this.signUpDates[i] >= this.startDate) {
            return this.invalidate("signUpDates", "Must be before game's start time");
        }
    }
    next();
});

module.exports = mongoose.model("Game", gameSchema);
