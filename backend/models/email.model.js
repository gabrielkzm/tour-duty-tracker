const mongoose = require('mongoose');
const Schema = mongoose.Schema

const emailSchema = new Schema(
    {
        to: {type: Array, required: true},
        from: {type: String, required: true},
        subject: {type: String, required: true},
        content: {type: String},
        tour: {type: String, required: true}
    },
    {
        timestamps: true
    }
);

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;