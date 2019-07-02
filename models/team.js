const mongoose = require("mongoose");
const { Schema } = mongoose;

const Team = new Schema({
    profile: {
        name: {
            type: String
        },
        description: {
            type: String
        },
        thumbnail: {
            type: String
        }
    },
    member: [],
    hash: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('team', Team);