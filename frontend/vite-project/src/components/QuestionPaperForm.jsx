import React, { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from "@mui/material";
import axios from "axios";

const QuestionPaperForm = ({ open, handleClose, fetchQuestionPapers }) => {
  const [formData, setFormData] = useState({
    subject: "",
    exam: "",
    total_marks: "",
    questions: [],
  });

  const [subjects, setSubjects] = useState([]); // List of subjects for suggestions
  const [exams, setExams] = useState([]); // List of exams for suggestions

  // Fetch subjects and exams for suggestions
  useEffect(() => {
    const fetchSubjectsAndExams = async () => {
      try {
        const subjectsResponse = await axios.get("http://localhost:8000/subject/all", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(subjectsResponse.data);
        setSubjects(subjectsResponse.data);

        const examsResponse = await axios.get("http://localhost:8000/exam/all", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(examsResponse.data);
        setExams(examsResponse.data);
      } catch (error) {
        console.error("Error fetching subjects or exams", error);
      }
    };

    fetchSubjectsAndExams();
  }, []);

  const handleInputChange = (e, value, field) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/questionPaper/create", formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchQuestionPapers(); // Refresh the list of question papers
      handleClose(); // Close the form
    } catch (error) {
      console.error("Error creating question paper", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Question Paper</DialogTitle>
      <DialogContent>
        {/* Subject Autocomplete */}
        <Autocomplete
          options={subjects}
          getOptionLabel={(subject) => subject.subjectName || ""}
          value={formData.subject}
          onChange={(e, value) => handleInputChange(e, value, "subject")}
          renderInput={(params) => (
            <TextField
              {...params}
              name="subject"
              label="Subject"
              fullWidth
              margin="normal"
            />
          )}
        />

        {/* Exam Autocomplete */}
        <Autocomplete
          options={exams}
          getOptionLabel={(exam) => exam.name || ""}
          value={formData.exam}
          onChange={(e, value) => handleInputChange(e, value, "exam")}
          renderInput={(params) => (
            <TextField
              {...params}
              name="exam"
              label="Exam"
              fullWidth
              margin="normal"
            />
          )}
        />

        {/* Total Marks */}
        <TextField
          name="total_marks"
          label="Total Marks"
          fullWidth
          margin="normal"
          value={formData.total_marks}
          onChange={(e) => handleInputChange(e, e.target.value, "total_marks")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionPaperForm;