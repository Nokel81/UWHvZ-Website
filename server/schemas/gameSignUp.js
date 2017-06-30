const mongoose = require("mongoose");
const uniqueness = require("mongoose-unique-validator");

const validEmail = rootRequire("server/schemas/validators/validUserEmail");
const Schema = mongoose.Schema;

const gameSignUp = new Schema({
    gameId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        validate: validEmail
    },
    teamPreference: {
        type: String,
        required: true,
        enum: ["Human", "Zombie"]
    }
});
gameSignUp.index({ gameId: 1, userEmail: 1}, { unique: true });
gameSignUp.plugin(uniqueness, { message: "{PATH} needs to be unique" });

module.exports = mongoose.model("GameSignUp", gameSignUp);
