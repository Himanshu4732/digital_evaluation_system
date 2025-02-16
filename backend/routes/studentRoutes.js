const express = require("express");
const { body } = require("express-validator");
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");
const Student = require("../models/studentModel");

const router = express.Router();

router.post(
    "/register",
    [
        body("email").isEmail().withMessage("Invalid Email"),
        body("name")
            .isLength({ min: 3 })
            .withMessage("Name should be at least 3 characters long"),
        body("password")
            .isLength({ min: 3 })
            .withMessage("Password should be at least 3 characters long"),
        body("roll_no")
            .notEmpty()
            .withMessage("Roll number is required"),
        body("section")
            .notEmpty()
            .withMessage("section is required"),
        body("semester")
            .notEmpty().isNumeric()
            .withMessage("Enter a valid semester"),
    ],
    studentController.registerStudent
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid Email"),
        body("password")
            .isLength({ min: 3 })
            .withMessage("Password should be at least 3 characters long"),
    ],
    studentController.loginStudent
);

router.get('/profile', authMiddleware.authStudent, studentController.getStudentProfile);

module.exports = router;