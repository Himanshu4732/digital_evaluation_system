import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Autocomplete } from "@mui/material";
import axios from "axios";

const AnswerPaperForm = ({ open, handleClose, fetchAnswerPapers }) => {
  const [formData, setFormData] = useState({
    subject: "",
    exam: "",
    studentEmail: "",
    total_marks: "",
    answerSheet: null,
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
        setSubjects(subjectsResponse.data);

        const examsResponse = await axios.get("http://localhost:8000/exam/all", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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

  const handleFileChange = (e) => {
    setFormData({ ...formData, answerSheet: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("subject", formData.subject?.subjectName || formData.subject);
      formDataToSend.append("exam", formData.exam?.name || formData.exam);
      formDataToSend.append("studentEmail", formData.studentEmail);
      formDataToSend.append("total_marks", formData.total_marks);
      formDataToSend.append("answerSheet", formData.answerSheet);

      const response = await axios.post("http://localhost:8000/answerpaper/create", formDataToSend, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Answer paper created:", response.data);
      // Refresh the list of answer papers
      handleClose(); // Close the form
    } catch (error) {
      console.error("Error creating answer paper", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload Answer Paper</DialogTitle>
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

        <TextField
          name="studentEmail"
          label="Student Email"
          fullWidth
          margin="normal"
          value={formData.studentEmail}
          onChange={(e) => handleInputChange(e, e.target.value, "studentEmail")}
        />
        <TextField
          name="total_marks"
          label="Total Marks"
          fullWidth
          margin="normal"
          value={formData.total_marks}
          onChange={(e) => handleInputChange(e, e.target.value, "total_marks")}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mt-4"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnswerPaperForm;