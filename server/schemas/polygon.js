const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const polygonSchema = new Schema({
    points: {
        type: [{
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        }],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        required: true,
        enum: ["#000000", "#ff0000", "#0000ff", "#00ff00", "#8b4513"]
    }
});

module.exports = mongoose.model("Polygon", polygonSchema);
