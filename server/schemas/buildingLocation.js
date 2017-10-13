const mongoose = require("mongoose");
const uniqueness = require("mongoose-unique-validator");

const errorNotFound = rootRequire("server/schemas/plugins/errorNotFound");
const Schema = mongoose.Schema;

const buildingLocationSchema = new Schema({
    acronym: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
});
buildingLocationSchema.plugin(uniqueness, {
    message: "{PATH} needs to be unique"
});
errorNotFound(buildingLocationSchema);

module.exports = mongoose.model("BuildingLocation", buildingLocationSchema);
