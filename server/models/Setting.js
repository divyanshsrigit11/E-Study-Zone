const mongoose = require('mongoose');

const settingSchema = mongoose.Schema({
    maintenanceMode: { type: Boolean, default: false },
    platformName: { type: String, default: 'E-Study Zone' }
});

module.exports = mongoose.model("Setting", settingSchema);