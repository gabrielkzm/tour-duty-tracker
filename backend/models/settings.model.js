const mongoose = require('mongoose');
const Schema = mongoose.Schema

const settingsSchema = new Schema(
    {
        tourAssignerName: {type: String, required: true},
        tourAssignerContact: {type: Number, required: true},
        tourAssignerEmail: {type: String, required: true},
        additionalDistributionList: {type: Array, required: true},
    },
    {
        timestamps: true
    }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;