const express = require('express');
const marksController = require('../controllers/marksController');

const router = express.Router();

// POST /marks/submit: Submit marks for a student’s answer sheet (teacher marks evaluation)
router.post('/submit', marksController.submitMarks);

// GET /marks/:id: Fetch marks for a specific answer sheet
router.get('/:id', marksController.getMarksById);

// PUT /marks/:id: Update marks for a specific answer sheet
router.put('/:id', marksController.updateMarksById);

// GET /marks/student/:studentId: Fetch marks for a specific student
router.get('/student/:studentId', marksController.getMarksByStudentId);

module.exports = router;