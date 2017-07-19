const mongoose = require("mongoose");

const errorNotFound = rootRequire('server/schemas/plugins/errorNotFound');
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
        default: "#000000",
        enum: ["#000000", "#ff0000", "#0000ff", "#00ff00", "#8b4513"]
    }
});
errorNotFound(polygonSchema)

module.exports = mongoose.model("Polygon", polygonSchema);
