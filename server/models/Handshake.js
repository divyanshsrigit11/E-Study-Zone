const mongoose = require('mongoose');

const handshakeSchema = new mongoose.Schema({
    trainerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    learnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    // Adding Skill Tracking
    skillId: {
        type: String, 
        required: true
    },
    skillName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'rejected', 'accepted'],
        default: 'pending' 
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model("Handshake", handshakeSchema);