const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ambassadorSchema = new Schema(
    {
        name: {type: String, required: true},
        //TODO: Future work can be improved here
        primaryDegree: {type: String, required: true},
        secondaryDegree: {type: String},
        batch: {type: Number, required: true},
        nationality: {type: String, required: true},
        race: {type: String, required: true},
        year: {type: Number, required: true},
        currentAvailability: {type: Boolean, required: true},
        unavailabilityReason: {type: String},
        unavailabilityFrom: {type: Date},
        unavailabilityTo: {type: Date},
        mandarinProficiency: {type: String, required: true},
        leadershipStatus: {type: Boolean, required: true},
        tourCount: {type: Map, of: Number},
        eventCount: {type: Map, of: Number},
        gender: {type: String, required: true},
        hasGraduated: {type: Boolean, required: true},
        contact: {type: Number, required: true},
        email: {type: String, required: true}
    },
    {
        timestamps: true
    }
);

const Ambassador = mongoose.model('Ambassador', ambassadorSchema);

module.exports = Ambassador;