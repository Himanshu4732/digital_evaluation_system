const express = require('express');
const { body } = require('express-validator');
const Question = require('../models/questionModel');
const questionController = require("../controllers/questionController")

const router = express.Router();

router.post(
    '/create',
    [
        body('questionNumber').isInt().withMessage('Question number must be an integer'),
        body('questionText').notEmpty().withMessage('Question text is required'),
        body('maxMarks').isInt().withMessage('Max marks must be an integer'),
        body('QuestionpaperId').isMongoId().withMessage('Invalid Question Paper ID')
    ],
    questionController.createQuestion
)

router.delete(
    '/delete/:id',
    questionController.deleteQuestion
);

module.exports = router;