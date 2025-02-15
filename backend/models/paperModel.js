const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    course_code: {
        type: String,
        required: true
    },
    date_of_exam: {
        type: Date,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    total_marks: {
        type: Number
    },
    obtained_marks: {
        type: Number
    },
    feedback: {
        type: String
    },
    status: {
        type: String,
        enum: ['Assigned', "Pending" , 'Evaluated'],
        default: 'Assigned'
    },
    
}, { timestamps: true });

const Paper = mongoose.model('Paper', paperSchema);

module.exports = Paper;