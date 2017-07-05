const mongoose = require("mongoose");

const ValidCode = rootRequire("server/schemas/validators/validCode");
const getUserType = rootRequire("server/data-access/functions/user/getUserType");
const getUserByPlayerCode = rootRequire("server/data-access/functions/user/getUserByPlayerCode");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    taggerCode: {
        type: String,
        required: true,
        validate: ValidCode
    },
    taggedCode: {
        type: String,
        required: true,
        validate: ValidCode
    },
    time: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    },
    decription: {
        type: String,
        required: true,
        minlength: 25
    }
});

reportSchema.pre("validate", function (next) {
    if (this.taggerCode === this.taggedCode) {
        this.invalidate("taggedCode", "Cannot tag yourself");
    }
    getUserByPlayerCode(this.taggerCode, res => {
        if (res.error) {
            this.invalidate("taggedCode", "Something went wrong");
            return next();
        }
        getUserType(res.body._id, taggerRes => {
            if (taggerRes.error) {
                this.invalidate("taggedCode", "Something went wrong");
                return next();
            }

            taggerRes = taggerRes.body;
            if (taggerRes !== "Human" && taggerRes !== "Zombie") {
                this.invalidate("taggerCode", "You have to be playing");
                return next();
            }
            getUserByPlayerCode(this.taggedCode, res => {
                if (res.error) {
                    this.invalidate("taggedCode", "Something went wrong");
                    return next();
                }
                getUserType(res.body._id, taggedRes => {
                    if (taggerRes.error) {
                        this.invalidate("taggedCode", "Something went wrong");
                        return next();
                    }
                    taggedRes = taggedRes.body;
                    if (taggedRes !== "Human" && taggedRes !== "Zombie") {
                        this.invalidate("taggedCode", "You have to tag someone who is playing");
                        return next();
                    }
                    if (taggedRes === taggerRes) {
                        this.invalidate("taggedCode", "You have to tag someone who is on the other team");
                    }
                    next();
                });
            });
        });
    });
});

module.exports = mongoose.model("Report", reportSchema);
