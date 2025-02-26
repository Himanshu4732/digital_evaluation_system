import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import axios from "axios";

const AnswerPaperForm = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    subject: "",
    exam: "",
    studentEmail: "",
    total_marks: "",
    answerSheet: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, answerSheet: e.target.files[0] });
  };

  

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("exam", formData.exam);
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
      fetchAnswerPapers(); // Refresh the list of answer papers
      handleClose(); // Close the form
    } catch (error) {
      console.error("Error creating answer paper", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload Answer Paper</DialogTitle>
      <DialogContent>
        <TextField
          name="subject"
          label="Subject"
          fullWidth
          margin="normal"
          value={formData.subject}
          onChange={handleInputChange}
        />
        <TextField
          name="exam"
          label="Exam"
          fullWidth
          margin="normal"
          value={formData.exam}
          onChange={handleInputChange}
        />
        <TextField
          name="studentEmail"
          label="Student Email"
          fullWidth
          margin="normal"
          value={formData.studentEmail}
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