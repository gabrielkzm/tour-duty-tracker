const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ambassadorSchema = new Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        //TODO: Future work can be improved here
        primaryDegree: {type: String, required: true},
        secondaryDegree: {type: String},
        batch: {type: Number, required: true},
        nationality: {type: String, required: true},
        race: {type: String, required: true},
        year: {type: Number, required: true},
        isAvailable: {type: Boolean, required: true},
        unavailabilityReason: {type: String},
        unavailableFrom: {type: Date},
        unavailableTo: {type: Date},
        isChineseProficient: {type: Boolean, required: true},
        hasClearedLeadership: {type: Boolean, required: true},
        tourCount: {type: Number, required: true},
        events: {type: Number, required: true},
    },
    {
        timestamps: true
    }
);

const Ambassador = mongoose.model('Ambassador', ambassadorSchema);

module.exports = Ambassador;