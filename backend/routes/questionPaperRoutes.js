const express = require("express");
const { body } = require("express-validator");
const questionPaperController = require("../controllers/questionPaperController")

const router = express.Router();
router.post(
    "/create",
    [
        body("subject").notEmpty().withMessage("Subject is required"),
        body("exam").notEmpty().withMessage("exam is required"),
        body("total_marks").isInt({ min: 0 }).withMessage("Total marks must be a positive integer"),
    ],
    questionPaperController.createQuestionPaper
);

//get all question papers
router.get("/all", questionPaperController.getAllQuestionPapers);

//view question paper by id
router.get("/:id", questionPaperController.getQuestionPaperById);

module.exports = router;
