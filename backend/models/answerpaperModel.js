const mongoose = require('mongoose');

const answerpaperSchema = new mongoose.Schema({
    subject: {
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
        type: Number ,
        required: true
    },
    obtained_marks: {
        type: Number
    },
    elavuation_date: {
        type: Date
    },
        feedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    },
    status: {
        type: String,
        enum: ['Assigned', "Pending" , 'Evaluated'],
        default: 'Assigned'
    },
    answerSheet: {
        type: String,
        required: true
    }
    
}, { timestamps: true });

const AnswerPaper = mongoose.model('AnswerPaper', answerpaperSchema);

module.exports = AnswerPaper;