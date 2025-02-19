const { validationResult } = require('express-validator');
const QuestionPaper = require('../models/questionPaperModel');

// filepath: /c:/Users/himan/OneDrive/Desktop/digitalEvaluationSystem/backend/controllers/questionPaperController.js

exports.createQuestionPaper = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { subject, date_of_exam, total_marks } = req.body;

    try {
        const questionPaper = new QuestionPaper({
            subject,
            date_of_exam,
            total_marks,
        });

        await questionPaper.save();
        res.status(201).json({ message: 'Question paper created successfully', questionPaper });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};