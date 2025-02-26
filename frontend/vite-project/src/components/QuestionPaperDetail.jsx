import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Paper, Typography, Button, TextField, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const QuestionPaperDetail = () => {
  const { id } = useParams();
  const [questionPaper, setQuestionPaper] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionNumber: "",
    questionText: "",
    maxMarks: "",
    QuestionpaperId: id,
  });

  const fetchQuestionPaper = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/questionPaper/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Fetched question paper:", response.data);
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
      console.log("Adding new question:", newQuestion);
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
      fetchQuestionPaper(); // Refresh the question paper data
      setNewQuestion({ questionNumber: "", questionText: "", maxMarks: "", QuestionpaperId: id }); // Reset form
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
      console.log(questionPaper) // Refresh the question paper data
    } catch (error) {
      console.error("Error deleting question", error);
    }
  };

  if (!questionPaper) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#ffffff" }}>
        Manage Questions for {questionPaper.subject.subjectName} - {questionPaper.exam.examType} ({questionPaper.exam.dateOfExam})
      </Typography>

      {/* Add Question Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: "#1e1e1e" }}>
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
          sx={{ mb: 2, input: { color: "#ffffff" }, label: { color: "#ffffff" } }}
          InputLabelProps={{
            style: { color: "#ffffff" },
          }}
        />
        <TextField
          name="questionText"
          label="Question Text"
          fullWidth
          margin="normal"
          value={newQuestion.questionText}
          onChange={handleInputChange}
          sx={{ mb: 2, input: { color: "#ffffff" }, label: { color: "#ffffff" } }}
          InputLabelProps={{
            style: { color: "#ffffff" },
          }}
        />
        <TextField
          name="maxMarks"
          label="Max Marks"
          fullWidth
          margin="normal"
          value={newQuestion.maxMarks}
          onChange={handleInputChange}
          sx={{ mb: 2, input: { color: "#ffffff" }, label: { color: "#ffffff" } }}
          InputLabelProps={{
            style: { color: "#ffffff" },
          }}
        />
        <Button variant="contained" color="primary" onClick={handleAddQuestion}>
          Add Question
        </Button>
      </Paper>

      {/* List of Questions */}
      <Paper elevation={3} sx={{ p: 4, backgroundColor: "#1e1e1e" }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
          Questions
        </Typography>
        {questionPaper.questions.map((question) => (
          <Box key={question._id} sx={{ mb: 2, p: 2, backgroundColor: "#2c2c2c", borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: "#ffffff" }}>
              Q{question.questionNumber}: {question.questionText} (Max Marks: {question.maxMarks})
            </Typography>
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