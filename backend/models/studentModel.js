const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    roll_no: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    marks: {
        type: Number
    },
    papers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paper'
    }],
    feedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }],

}, { timestamps: true });

student.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
  }
  
  student.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  }
  
  student.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
  }

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;