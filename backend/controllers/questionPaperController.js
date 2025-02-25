const { validationResult } = require('express-validator');
const QuestionPaper = require('../models/questionPaperModel');
const examModel = require('../models/examModel');
const subjectModel = require('../models/subjectModel');

// filepath: /c:/Users/himan/OneDrive/Desktop/digitalEvaluationSystem/backend/controllers/questionPaperController.js

exports.createQuestionPaper = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { subject, exam, total_marks } = req.body;


 const examId = await examModel.findOne({ name : exam });

    if (!examId) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const subjectId = await subjectModel.findOne({ name : subject });

    if (!subjectId) {
      return res.status(404).json({ message: "Subject not found" });
    }

    try {
        const questionPaper = new QuestionPaper({
            subject: subjectId._id,
            exam,
            total_marks: total_marks,
        });

        await questionPaper.save();
        res.status(201).json({ message: 'Question paper created successfully', questionPaper });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};