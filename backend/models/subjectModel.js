const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        required: true,
        unique: true
    },
   
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;