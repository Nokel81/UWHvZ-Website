const mongoose = require("mongoose");
const uniqueness = require("mongoose-unique-validator");

const errorNotFound = rootRequire("server/schemas/plugins/errorNotFound");
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    gameEmails: {
        type: Boolean,
        default: true
    },
    promotionalEmails: {
        type: Boolean,
        default: true
    },
    showScore: {
        type: Boolean,
        default: true
    },
    treeNodeColour: {
        type: String,
        default: "#0000ff",
        validator: {
            isAsync: false,
            validator(value) {
                if (value.length !== 4 || value.length !== 7) {
                    return false;
                }
                if (value[0] != "#") {
                    return false;
                }
                value = value.substring(1).toLowerCase();
                value = value.length < 6 ? value[0] + value[0] + value[1] + value[1] + value[2] + value[2] : value.substr(0, 6);

                if (!value.match(/[0-9a-f]+/g)) {
                    return false;
                }
                return true;
            },
            message: "Colour must be correct format"
        }
    }
});
settingsSchema.plugin(uniqueness, {
    message: "{PATH} needs to be unique"
});
errorNotFound(settingsSchema);

module.exports = mongoose.model("Settings", settingsSchema);
