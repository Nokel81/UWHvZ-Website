const mongoose = require("mongoose");

const errorNotFound = rootRequire("server/schemas/plugins/errorNotFound");
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
    signUpLocationDates: {
        type: [[Date]],
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
    originalZombies: {
        type: [Schema.Types.ObjectId]
    },
    starvedZombies: {
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
    },
    isStarted: {
        type: Boolean,
        default: false
    }
});

gameSchema.pre("validate", function(next) {
    if (this.startDate >= this.endDate) {
        return this.invalidate("startDate", "Must be before game's end time");
    }

    if (this.signUpLocations.length !== this.signUpLocationDates.length) {
        return this.invalidate("There must a set of dates for each location");
    }

    for (let i = 0; i < this.signUpLocationDates.length; i++) {
        if (this.signUpLocationDates[i].length === 0) {
            return this.invalidate("Every location must have at least one date");
        }
    }

    for (let i = 0; i < this.signUpDates.length; i++) {
        if (this.signUpDates[i] >= this.startDate) {
            return this.invalidate("signUpDates", "Must be before game's start time");
        }
    }

    this.originalZombies.forEach(oz => {
        if (!this.zombies.find(zom => zom.toString() === oz.toString())) {
            return this.invalidate("originalZombies", "All original zombies must be zombies");
        }
    });

    this.starvedZombies.forEach(sz => {
        if (!this.zombies.find(zom => zom.toString() === sz.toString())) {
            return this.invalidate("starvedZombies", "All original zombies must be zombies");
        }
    });
    next();
});
errorNotFound(gameSchema);

module.exports = mongoose.model("Game", gameSchema);
