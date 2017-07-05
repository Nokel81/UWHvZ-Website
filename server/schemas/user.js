const mongoose = require("mongoose");
const uniqueness = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
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
        unique: true,
        set: v => v.replace(/(\b[a-z](?!\s))/g, x => x.toUpperCase())
    },
    confirmationToken: {
        type: String
    }
});
userSchema.plugin(uniqueness, {message: "{PATH} needs to be unique"});

module.exports = mongoose.model("User", userSchema);
