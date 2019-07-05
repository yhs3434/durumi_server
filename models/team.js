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
            type: String,
            default: "/images/teamDefault.jpg"
        }
    },
    member: [],
    hashTag: [String],
    determine: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('team', Team);