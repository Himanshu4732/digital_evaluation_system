const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const paperController = require("../controllers/paperController");
const auth = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerMiddleware");

router.post(
  "/create",
  upload.single("answerSheet")
  ,
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
  paperController.createPaper
);

// assigning paper to teacher for checking
router.patch(
  "/assign/:paperId",
  [auth.authAdmin, body("teacherEmail").notEmpty().withMessage("teacher is required")],
  paperController.assignPaper
);

//checking paper and giving marks
router.patch(
  "/check/:paperId",
  [
    auth.authTeacher,
    body("marks").notEmpty().withMessage("marks is required"),
  ],
  paperController.checkPaper
);

//getting all papers of a student
router.get("/student", auth.authStudent, paperController.getStudentPapers);

//getting all papers of a teacher
router.get("/teacher", auth.authTeacher, paperController.getTeacherPapers);

module.exports = router;