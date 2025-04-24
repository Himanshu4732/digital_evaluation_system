import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EvaluateAnswerSheet = () => {
  const { answerSheetId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [marksArray, setMarksArray] = useState([]);
  const [answerSheetUrl, setAnswerSheetUrl] = useState("");
  const [marksSubmitted, setMarksSubmitted] = useState(false);
  const navigate = useNavigate();
  const [questionPaperId, setQuestionPaperId] = useState(null);


    useEffect(() => {
      const fetchAnswerSheetAndQuestions = async () => {
        try {
          const answerSheetResponse = await axios.get(
            `http://localhost:8000/answerpaper/${answerSheetId}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
    
          setAnswerSheetUrl(answerSheetResponse.data.answerSheet);
          if (answerSheetResponse.data.status === "Evaluated") {
            setMarksSubmitted(true);
            setMarksArray(answerSheetResponse.data.marksArray || []);
          }

          const questionPaperId = answerSheetResponse.data.questionPaper
    
      
    
          const questionsResponse = await axios.get(
            `http://localhost:8000/questionPaper/${questionPaperId}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
    
          setQuestions(questionsResponse.data.questions);
        } catch (error) {
          console.error("Error fetching answer sheet or questions:", error);
        }
      };
    
      fetchAnswerSheetAndQuestions();
    }, [answerSheetId]);
    
  const handleMarkChange = (event) => {
    const newMarksArray = [...marksArray];
    newMarksArray[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex]._id,
      obtainMarks: parseInt(event.target.value, 10),
    };
    setMarksArray(newMarksArray);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitMarks = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/answerpaper/check/${answerSheetId}`,
        { marksArray },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Marks submitted successfully!");
      setMarksSubmitted(true);
    } catch (error) {
      console.error("Error submitting marks:", error);
      alert("Failed to submit marks.");
    }
  };

  const darkThemeStyles = {
    paper: {
      backgroundColor: "#1e1e1e",
      color: "white",
    },
    button: {
      color: "white",
      backgroundColor: "#1976d2",
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    },
    submitButton: {
      color: "white",
      backgroundColor: "#4caf50",
      "&:hover": {
        backgroundColor: "#388e3c",
      },
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      accent: "#64b5f6",
    },
    textField: {
      backgroundColor: "#2d2d2d",
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
  };

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <div className="flex items-center mb-6 gap-4">
        <Button
          variant="contained"
          style={darkThemeStyles.button}
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Typography variant="h4" style={{ color: darkThemeStyles.text.accent }}>
          Evaluate Answer Sheet
        </Typography>
      </div>

      <Grid container spacing={4}>
        {/* Left-hand side: Answer Sheet */}
        <Grid item xs={12} md={6}>
          <Paper elevation={10} style={darkThemeStyles.paper} className="p-6">
            <Typography
              variant="h6"
              style={{ color: darkThemeStyles.text.accent }}
              className="mb-4"
            >
              Answer Sheet
            </Typography>
            {answerSheetUrl && (
              <iframe
                src={answerSheetUrl}
                width="100%"
                height="500px"
                style={{ border: "none" }}
                title="PDF Viewer"
              />
            )}
          </Paper>
        </Grid>

       
        <Grid item xs={12} md={6}>
          {marksSubmitted && (
            <Paper
              elevation={10}
              style={darkThemeStyles.paper}
              className="mb-4 p-4 text-center"
            >
              <Typography variant="h5" style={{ color: "#4caf50" }}>
                Marks Submitted Successfully
              </Typography>
            </Paper>
          )}
          <Paper elevation={10} style={darkThemeStyles.paper} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <IconButton
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                style={{ color: darkThemeStyles.text.accent }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant="h6"
                style={{ color: darkThemeStyles.text.accent }}
              >
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
              <IconButton
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                style={{ color: darkThemeStyles.text.accent }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </div>

            {questions.length > 0 && (
              <>
                <div
                  className="mb-4"
                  style={{ color: darkThemeStyles.text.primary }}
                >
                  <Typography variant="body1" className="mb-2">
                    <strong>Question:</strong>{" "}
                    {questions[currentQuestionIndex].questionText}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Max Marks:</strong>{" "}
                    {questions[currentQuestionIndex].maxMarks}
                  </Typography>
                </div>

                <TextField
                  fullWidth
                  label="Enter Marks"
                  type="number"
                  value={marksArray[currentQuestionIndex]?.obtainMarks || ""}
                  onChange={handleMarkChange}
                  className="mb-4"
                  disabled={marksSubmitted}
                  sx={darkThemeStyles.textField}
                  slotProps={{
                    input: {
                      min: 0,
                      max: questions[currentQuestionIndex]?.maxMarks,
                    },
                  }}
                  error={
                    marksArray[currentQuestionIndex]?.obtainMarks >
                    questions[currentQuestionIndex]?.maxMarks
                  }
                  helperText={
                    marksArray[currentQuestionIndex]?.obtainMarks >
                    questions[currentQuestionIndex]?.maxMarks
                      ? `Marks cannot exceed ${questions[currentQuestionIndex]?.maxMarks}`
                      : ""
                  }
                />

                {!marksSubmitted &&
                  currentQuestionIndex === questions.length - 1 && (
                    <Button
                      variant="contained"
                      style={darkThemeStyles.submitButton}
                      onClick={handleSubmitMarks}
                      className="w-full"
                    >
                      Submit Marks
                    </Button>
                  )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default EvaluateAnswerSheet;
