const mongoose = require("mongoose");
const uniqueness = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const buildingLocationSchema = new Schema({
    acronym: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true
    },
});
buildingLocationSchema.plugin(uniqueness, { message: "{PATH} needs to be unique" });

module.exports = mongoose.model("BuildingLocation", buildingLocationSchema);
