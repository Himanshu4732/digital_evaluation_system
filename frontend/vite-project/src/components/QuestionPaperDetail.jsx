import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Paper, Typography, Button, TextField, IconButton, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const QuestionPaperDetail = () => {
  const { id } = useParams();
  const [questionPaper, setQuestionPaper] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionNumber: "",
    questionText: "",
    maxMarks: "",
    part: "",
    QuestionpaperId: id,
  });

  const partOptions = ['A', 'B', 'C', 'D']; 

  const fetchQuestionPaper = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/questionPaper/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuestionPaper(response.data);
    } catch (error) {
      console.error("Error fetching question paper", error);
    }
  };

  useEffect(() => {
    fetchQuestionPaper();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion({ ...newQuestion, [name]: value });
  };

  const handleAddQuestion = async () => {
    try {
      await axios.post(
        `http://localhost:8000/question/create`,
        newQuestion,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchQuestionPaper();
      setNewQuestion({ 
        questionNumber: "", 
        questionText: "", 
        maxMarks: "", 
        part: "",
        QuestionpaperId: id 
      });
    } catch (error) {
      console.error("Error adding question", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:8000/question/delete/${questionId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchQuestionPaper();
    } catch (error) {
      console.error("Error deleting question", error);
    }
  };

  if (!questionPaper) {
    return <div>Loading...</div>;
  }

  const darkThemeStyles = {
    paper: {
      backgroundColor: "#1e1e1e",
      color: "white",
    },
    textField: {
      backgroundColor: "#2d2d2d",
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
    select: {
      color: "white",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255, 255, 255, 0.23)",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255, 255, 255, 0.5)",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2",
      }
    },
    menuPaper: {
      backgroundColor: "#1e1e1e",
      color: "white",
      "& .MuiMenuItem-root": {
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        },
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#ffffff" }}>
        Manage Questions for {questionPaper.subject.subjectName} - {questionPaper.exam.examType} ({questionPaper.exam.dateOfExam})
      </Typography>

      {/* Add Question Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, ...darkThemeStyles.paper }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
          Add New Question
        </Typography>
        
        <TextField
          name="questionNumber"
          label="Question Number"
          fullWidth
          margin="normal"
          value={newQuestion.questionNumber}
          onChange={handleInputChange}
          sx={{ mb: 2, ...darkThemeStyles.textField }}
        />
        
        <TextField
          name="questionText"
          label="Question Text"
          fullWidth
          margin="normal"
          value={newQuestion.questionText}
          onChange={handleInputChange}
          sx={{ mb: 2, ...darkThemeStyles.textField }}
        />
        
        <TextField
          name="maxMarks"
          label="Max Marks"
          fullWidth
          margin="normal"
          value={newQuestion.maxMarks}
          onChange={handleInputChange}
          sx={{ mb: 2, ...darkThemeStyles.textField }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Part</InputLabel>
          <Select
            name="part"
            value={newQuestion.part}
            onChange={handleInputChange}
            sx={{ mb: 2, ...darkThemeStyles.textField }}
            MenuProps={{
              PaperProps: {
                sx: darkThemeStyles.menuPaper
              }
            }}
          >
            <MenuItem value="">
              <em>Select Part</em>
            </MenuItem>
            {partOptions.map((part) => (
              <MenuItem key={part} value={part}>
                Part {part}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button variant="contained" color="primary" onClick={handleAddQuestion}>
          Add Question
        </Button>
      </Paper>

      {/* List of Questions */}
      <Paper elevation={3} sx={{ p: 4, ...darkThemeStyles.paper }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
          Questions
        </Typography>
        {questionPaper.questions.map((question) => (
          <Box key={question._id} sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: "#2c2c2c", 
            borderRadius: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <Typography variant="body1" sx={{ color: "#ffffff" }}>
                Q{question.questionNumber}: {question.questionText}
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                Max Marks: {question.maxMarks} | Part: {question.part || "N/A"}
              </Typography>
            </div>
            <IconButton
              sx={{ color: "#f44336" }}
              onClick={() => handleDeleteQuestion(question._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default QuestionPaperDetail;