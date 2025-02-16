const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const paperController = require("../controllers/paperController");
const auth = require("../middlewares/authMiddleware");

router.post(
  "/create",
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
    body("answerSheet").notEmpty().withMessage("answerSheet is required"),
    body("studentEmail").notEmpty().withMessage("student is required"),
  ],
  paperController.createPaper
);

module.exports = router;