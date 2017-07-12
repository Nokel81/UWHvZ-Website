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
                if (c1[0] != '#' || c2[0] != '#') {
                    return false;
                }
                c1 = c1.substring(1).toLowerCase();
                c2 = c2.substring(1).toLowerCase();
                c1 = c1.length < 6 ? c1[0] + c1[0] + c1[1] + c1[1] + c1[2] + c1[2] : c1.substr(0, 6);
                c2 = c2.length < 6 ? c2[0] + c2[0] + c2[1] + c2[1] + c2[2] + c2[2] : c2.substr(0, 6);

                if (!c1.match(/[0-9a-f]+/g) || !c2.match(/[0-9a-f]+/g)) {
                    return false;
                }
                return true;
            },
            message: "Colour must be correct format"
        }
    }
});
settingsSchema.plugin(uniqueness, {message: "{PATH} needs to be unique"});

module.exports = mongoose.model("Settings", settingsSchema);
