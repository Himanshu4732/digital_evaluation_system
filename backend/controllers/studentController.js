const studentModel = require("../models/studentModel");
const studentServer = require("../services/studentServer");
const { validationResult } = require("express-validator");
const { uploadOnCloudinary } = require("../utils/cloudinaryUtils")

module.exports.registerStudent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, roll_no, section, semester } = req.body;

    const isStudentAlready = await studentModel.findOne({ email });

    if (isStudentAlready) {
        return res.status(400).json({ message: "Student already exists" });
    }

    const { avatar } = req.files;

  // Upload avatar and cover image to Cloudinary
  const avatarUploadResponse = await uploadOnCloudinary(avatar[0].path);

  // Now you have the URLs for the uploaded files:
  const avatarUrl = avatarUploadResponse.url;

    const hashedPassword = await studentModel.hashPassword(password);

    const student = await studentServer.createStudent({
        name,
        email,
        section,
        roll_no,
        semester,
        password: hashedPassword,
    });

    const token = student.generateAuthToken();

    res.status(201).json({ token, student , avatarUrl});
};

module.exports.loginStudent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const student = await studentModel.findOne({ email }).select("+password");

    if (!student) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await student.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = student.generateAuthToken();

    res.cookie("token", token);

    res.status(200).json({ token, student });
};

module.exports.getStudentProfile = async (req, res, next) => {
    res.status(200).json(req.student);
};
