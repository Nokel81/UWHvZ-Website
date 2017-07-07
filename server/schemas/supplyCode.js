const mongoose = require("mongoose");
const uniqueness = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const supplyCodeSchema = new Schema({
    value: {
        type: Number,
        required: true,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    usedBy: {
        type: Schema.Types.ObjectId
    },
    forGame: {
        type: Schema.Types.ObjectId
    }
});
supplyCodeSchema.plugin(uniqueness, {message: "{PATH} needs to be unique"});

module.exports = mongoose.model("SupplyCode", supplyCodeSchema);
