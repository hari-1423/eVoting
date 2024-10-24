const mongoose = require('mongoose');

const addCandidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        partyname: {
            type: String,
            required: true,
            unique: true
        },
        votes: {
            type: Number,
        },
        url: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        },
        
    },
    {
        collection: 'CandidateInfo',
    }
);

const Candidate = mongoose.model('CandidateInfo', addCandidateSchema)
module.exports = Candidate