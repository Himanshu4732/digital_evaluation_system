const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    paperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paper',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    marksObtained: {
        type: Number,
        required: true
    }
},{timestamps:true});

const Marks = mongoose.model('Marks', marksSchema);

module.exports = Marks;