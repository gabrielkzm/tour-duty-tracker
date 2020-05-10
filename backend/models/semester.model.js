const mongoose = require('mongoose');
const Schema = mongoose.Schema

const semesterSchema = new Schema(
    {
        startDate: {type: Date, required: true},
        endDate: {type: Date, required: true}
    },
    {
        timestamps: true
    }
);

const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;