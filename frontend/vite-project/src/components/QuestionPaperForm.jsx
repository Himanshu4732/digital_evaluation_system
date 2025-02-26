import React, { useState } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import axios from "axios";

const QuestionPaperForm = ({ open, handleClose, fetchQuestionPapers }) => {
  const [formData, setFormData] = useState({
    subject: "",
    exam: "",
    total_marks: "",
    questions: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/admin/question-papers", formData, {
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
        <TextField
          name="subject"
          label="Subject ID"
          fullWidth
          margin="normal"
          value={formData.subject}
          onChange={handleInputChange}
        />
        <TextField
          name="exam"
          label="Exam ID"
          fullWidth
          margin="normal"
          value={formData.exam}
          onChange={handleInputChange}
        />
        <TextField
          name="total_marks"
          label="Total Marks"
          fullWidth
          margin="normal"
          value={formData.total_marks}
          onChange={handleInputChange}
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