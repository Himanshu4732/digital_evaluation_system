const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');


router.post('/add', examController.addExam);


router.delete('/delete/:id', examController.deleteExam);


router.get('/all', examController.getAllExams);

module.exports = router;