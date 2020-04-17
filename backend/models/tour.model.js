const mongoose = require('mongoose');
const Schema = mongoose.Schema

const tourSchema = new Schema(
    {
        name: {type: String, required: true},
        date: {type: Date, required: true},
        startTime: {type: Date, required: true},
        endTime: {type: Date},
        //TODO: Use an enum for this
        type: {type: String, required: true},
        ambassadorAccepted: {type: [mongoose.Types.ObjectId], required: true},
        ambassadorDeclinedWithReason: {type: [mongoose.Types.ObjectId], required: true},
        ambassadorDeclinedWithoutReason: {type: [mongoose.Types.ObjectId], required: true},
        assignedAmbassadors: {type: [mongoose.Types.ObjectId], required: true},
        ambassadorIC: {type: mongoose.Types.ObjectId, required: true}
    },
    {
        timestamps: true
    }
);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;