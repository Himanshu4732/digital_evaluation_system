const answerpaperModel = require("../models/answerpaperModel");
const { validationResult } = require("express-validator");
const studentModel = require("../models/studentModel");
const teacherModel = require("../models/teacherModel");
const { uploadOnCloudinary } = require("../utils/cloudinaryUtils");
const marksModel = require("../models/marksModel");

exports.createanswerPaper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { subject, date_of_exam, studentEmail, total_marks } = req.body;

  try {
    const studentDetail = await studentModel.findOne({ email: studentEmail });

    if (!studentDetail) {
      return res.status(404).json({ message: "Student not found" });
    }

    const pdf = req.file;

    if (!pdf) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const answerUploadResponse = await uploadOnCloudinary(pdf.path, "pdf", pdf.mimetype);

    const answerSheetUrl = answerUploadResponse.url;

    const newPaper = new answerpaperModel({
      subject,
      date_of_exam,
      student: studentDetail._id,
      total_marks,
      answerSheet: answerSheetUrl,
    });

    await newPaper.save();
    studentDetail.papers.push(newPaper._id);
    await studentDetail.save();
    res.status(201).json({ message: "Paper created successfully", paper: newPaper });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.assignanswerPaper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { teacherEmail } = req.body;
  const answerpaperId = req.params.answerpaperId;

  try {
    const paper = await answerpaperModel.findById(answerpaperId);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    const teacher = await teacherModel.findOne({ email: teacherEmail });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    paper.teacher = teacher._id;
    await paper.save();

    if (!teacher.assignedPapers.includes(paper._id)) {
      teacher.assignedPapers.push(paper._id);
      await teacher.save();
    }

    res.status(200).json({ message: "Paper assigned successfully", paper });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.checkanswerPaper = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(req.body.marks); // Debugging: Log marks to see what's being passed

  const marks = req.body.marks;
  const answerpaperId = req.params.answerpaperId;

  if (!Array.isArray(marks)) {
    return res.status(400).json({ message: "Marks must be an array" });
  }

  try {
    const paper = await answerpaperModel.findById(answerpaperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    for (const mark of marks) {
      if (mark.obtainMarks < 0) {
        return res.status(400).json({ message: "Marks cannot be negative" });
      }

      if (mark.obtainMarks > paper.total_marks) {
        return res.status(400).json({ message: "Marks cannot be greater than total marks" });
      }

      const marksCreate = await marksModel.create({
        marksObtained: mark.obtainMarks,
        questionId: mark.questionId,
        answerPaper: answerpaperId,
      });

      paper.marks.push(marksCreate._id);
    }

    await paper.save();

    res.status(200).json({ message: "Paper checked successfully", paper });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getStudentanswerPapers = async (req, res) => {
  try {
    const studentPapers = await answerpaperModel.find({ student: req.user.id });
    res.status(200).json({ papers: studentPapers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTeacheranswerPapers = async (req, res) => {
  try {
    const teacherPapers = await answerpaperModel.find({ teacher: req.user._id });
    res.status(200).json({ papers: teacherPapers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
