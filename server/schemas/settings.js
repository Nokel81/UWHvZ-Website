const mongoose = require("mongoose");
const uniqueness = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    gameEmails: {
        type: Boolean,
        required: true
    },
    promotionalEmails: {
        type: Boolean,
        required: true
    }
});
settingsSchema.plugin(uniqueness, {message: "{PATH} needs to be unique"});

module.exports = mongoose.model("Settings", settingsSchema);
