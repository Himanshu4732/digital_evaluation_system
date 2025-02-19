const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionText: {
        type: String,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    paperId: {
        type: Schema.Types.ObjectId,
        ref: 'Paper',
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;