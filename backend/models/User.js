
const mongoose = require('mongoose');

const UserDetailSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true,
            unique: true
        },
        dob: {
            type: Date,
            required: true
        },
        pass: {
            type: String,
            required: true
        },
        conPass: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        upVote: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'UserInfo',
    }
);

const User = mongoose.model('UserInfo', UserDetailSchema)
module.exports = User
