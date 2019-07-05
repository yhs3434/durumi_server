const mongoose = require('mongoose');
const { Schema } = mongoose;

const Account = new Schema({
    profile: {
        username: String,
        thumbnail: {
            type: String,
            default: '/images/accountDefault.jpg'
        }
    },
    email: {
        type: String
    },
    social: {
        facebook: {
            id: String,
            accessToken: String
        },
        google: {
            id: String,
            accessToken: String
        }
    },
    password: String,
    thoughtCount:{
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Account', Account);