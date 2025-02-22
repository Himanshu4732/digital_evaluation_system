const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const answerpaperController = require("../controllers/answerpaperController");
const auth = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerMiddleware");

router.post(
  "/create",
  upload.single("answerSheet"),
  [
    auth.authAdmin,
    body("subject").notEmpty().withMessage("subject is required"),
    body("date_of_exam")
      .isDate()
      .notEmpty()
      .withMessage("valid date is required"),
    body("total_marks")
      .notEmpty()
      .isNumeric()
      .withMessage("valid number is required"),
    body("studentEmail").notEmpty().withMessage("student is required"),
  ],
  answerpaperController.createanswerPaper
);

// assigning answerpaper to teacher for checking
router.post(
  "/assign/:answerpaperId",
  [auth.authAdmin, body("teacherEmail").notEmpty().withMessage("teacher is required")],
  answerpaperController.assignanswerPaper
);

// checking answerpaper and giving marks
router.patch(
  "/check/:answerpaperId",
  [
    auth.authTeacher,
    body("marks").notEmpty().withMessage("marks is required"),
  ],
  answerpaperController.checkanswerPaper
);

// getting all answerpapers of a student
router.get("/student", auth.authStudent, answerpaperController.getStudentanswerPapers);

// getting all answerpapers of a teacher
router.get("/teacher", auth.authTeacher, answerpaperController.getTeacheranswerPapers);

module.exports = router;