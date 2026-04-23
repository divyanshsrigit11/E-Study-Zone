const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);