import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Autocomplete } from "@mui/material";
import axios from "axios";

const AnswerPaperForm = ({ open, handleClose, fetchAnswerPapers = () => {} }) => {
  const [formData, setFormData] = useState({
    subject: "",
    exam: "",
    studentEmail: "",
    total_marks: "",
    answerSheet: null,
  });

  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchSubjectsAndExams = async () => {
      try {
        const subjectsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/subject/all`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSubjects(subjectsResponse.data);

        const examsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exam/all`, {
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

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/answerpaper/create`, formDataToSend, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (typeof fetchAnswerPapers === 'function') {
        fetchAnswerPapers();
      }
      handleClose();
    } catch (error) {
      console.error("Error creating answer paper", error);
    }
  };

  const darkThemeStyles = {
    dialog: {
      backgroundColor: "rgb(50,50,50)",
    },
    textField: {
      backgroundColor: "rgb(60,60,60)",
      color: "white",
      "& .MuiInputBase-input": {
        color: "white",
      },
      "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.7)",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "rgba(255,255,255,0.3)",
        },
        "&:hover fieldset": {
          borderColor: "rgba(255,255,255,0.5)",
        },
      },
    },
    button: {
      color: "white",
      backgroundColor: "rgb(40,40,40)",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.1)",
      },
    },
    autocomplete: {
      "& .MuiAutocomplete-popper": {
        "& .MuiPaper-root": {
          backgroundColor: "rgb(60,60,60)",
          color: "white",
          "& .MuiAutocomplete-option": {
            "&[data-focus='true']": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          },
        },
      },
    },
    fileInput: {
      color: "white",
      marginTop: "16px",
      "&::file-selector-button": {
        backgroundColor: "rgb(70,70,70)",
        color: "white",
        padding: "8px 16px",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: "4px",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgb(90,90,90)",
        },
      },
    },
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ style: darkThemeStyles.dialog }}>
      <DialogTitle style={{ color: "white" }}>Upload Answer Paper</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={subjects}
          getOptionLabel={(subject) => subject.subjectName || ""}
          value={formData.subject}
          onChange={(e, value) => handleInputChange(e, value, "subject")}
          sx={darkThemeStyles.autocomplete}
          renderInput={(params) => (
            <TextField
              {...params}
              name="subject"
              label="Subject"
              fullWidth
              margin="normal"
              sx={darkThemeStyles.textField}
            />
          )}
        />

        <Autocomplete
          options={exams}
          getOptionLabel={(exam) => exam.name || ""}
          value={formData.exam}
          onChange={(e, value) => handleInputChange(e, value, "exam")}
          sx={darkThemeStyles.autocomplete}
          renderInput={(params) => (
            <TextField
              {...params}
              name="exam"
              label="Exam"
              fullWidth
              margin="normal"
              sx={darkThemeStyles.textField}
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
          sx={darkThemeStyles.textField}
        />

        <TextField
          name="total_marks"
          label="Total Marks"
          fullWidth
          margin="normal"
          value={formData.total_marks}
          onChange={(e) => handleInputChange(e, e.target.value, "total_marks")}
          sx={darkThemeStyles.textField}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={darkThemeStyles.fileInput}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={darkThemeStyles.button}>Cancel</Button>
        <Button onClick={handleSubmit} sx={darkThemeStyles.button}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnswerPaperForm;