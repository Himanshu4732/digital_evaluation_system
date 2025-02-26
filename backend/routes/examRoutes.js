const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// Route to add an exam
router.post('/add', examController.addExam);

// Route to delete an exam
router.delete('/delete/:id', examController.deleteExam);

// Route to show all exams
router.get('/all', examController.getAllExams);

module.exports = router;