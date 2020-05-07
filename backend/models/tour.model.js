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
        numberOfGuests: {type: Number, required: true},
        numberOfAmbassadorsRequired: {type: Number, required: true},
        ambassadorAccepted: {type: [mongoose.Types.ObjectId], required: true},
        ambassadorDeclinedWithReason: {type: [mongoose.Types.ObjectId], required: true},
        ambassadorDeclinedWithoutReason: {type: [mongoose.Types.ObjectId], required: true},
        assignedAmbassadors: {type: [mongoose.Types.ObjectId], required: true},
        ambassadorIC: {type: mongoose.Types.ObjectId, required: true},
        attire: {type: String, required: true},
        purposeOfTour: {type: String, required: true},
        guestProfile: {type: String, required: true},
        checkPoints: {type: String, required: true},
        startPoint: {type: String, required: true},
        endPoint: {type: String, required: true},
        remarks: {type: String},
        //TODO: Enum/Another Collection?
        office: {type: String, required: true},
        officePhoneContact: {type: Number},
        officeEmailContact: {type: String},
        officeLiaison: {type: String, required: true},
        status: {type: String, required: true},
    },
    {
        timestamps: true
    }
);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;