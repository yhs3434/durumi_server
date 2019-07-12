const mongoose = require('mongoose');
const { Schema } = mongoose;

const Message = new Schema({
    userId: {
        type: String
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Chat = new Schema({
    teamId: {
        type: String
    },
    message: [Message]
})

const model = mongoose.model("Chat",Chat);
module.exports = model;