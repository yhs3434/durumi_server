const mongoose = require("mongoose");
const { Schema } = mongoose;

const Board = new Schema({
    userId: String,
    title: String,
    subheader: String,
    content: String,
    like: {
        count: {
            type: Number,
            default: 0
        },
        liked: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

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
    member: [String],
    hashTag: [String],
    board: [Board],
    determine: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        default: '미정'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('team', Team);