const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: /[a-z0-9.]+@[a-z0-9]+(\.[a-z0-9]+)+/g,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nonce: {
        type: String,
        required: true
    },
    playerCode: {
        type: String,
        required: true,
        unique: true
    },
    playerName: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("User", userSchema);
