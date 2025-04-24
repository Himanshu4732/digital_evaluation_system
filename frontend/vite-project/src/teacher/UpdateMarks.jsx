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

const UpdateMarks = () => {
  const { answerSheetId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [marksArray, setMarksArray] = useState([]);
  const [answerSheetUrl, setAnswerSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatedMarks, setUpdatedMarks] = useState([]);
  const [questionPaperId, setQuestionPaperId] = useState("");

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
        setMarksArray(answerSheetResponse.data.marks || []);
    
        const qPaperId = answerSheetResponse.data.questionPaper;
        setQuestionPaperId(qPaperId);
    
        if (!qPaperId) {
          console.error("Question Paper ID not found in marks data");
          setIsLoading(false);
          return;
        }
    
        const questionsResponse = await axios.get(
          `http://localhost:8000/questionPaper/${qPaperId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
    
        setQuestions(questionsResponse.data.questions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    

    fetchAnswerSheetAndQuestions();
  }, [answerSheetId]);
  console.log(questionPaperId)
  const handleMarkChange = (event) => {
    const value = parseInt(event.target.value, 10);
    const maxMarks = questions[currentQuestionIndex]?.maxMarks || 0;
    const currentMarkId = marksArray[currentQuestionIndex]?._id;

    if (isNaN(value)) {
      const newMarksArray = [...marksArray];
      newMarksArray[currentQuestionIndex] = {
        ...newMarksArray[currentQuestionIndex],
        marksObtained: "",
      };
      setMarksArray(newMarksArray);
    } else if (value >= 0 && value <= maxMarks) {
      const newMarksArray = [...marksArray];
      newMarksArray[currentQuestionIndex] = {
        ...newMarksArray[currentQuestionIndex],
        marksObtained: value,
      };
      setMarksArray(newMarksArray);

      const existingUpdateIndex = updatedMarks.findIndex(
        (mark) => mark.id === currentMarkId
      );

      if (existingUpdateIndex !== -1) {
        const newUpdatedMarks = [...updatedMarks];
        newUpdatedMarks[existingUpdateIndex] = {
          id: currentMarkId,
          obtainMarks: value,
        };
        setUpdatedMarks(newUpdatedMarks);
      } else {
        setUpdatedMarks([
          ...updatedMarks,
          { id: currentMarkId, obtainMarks: value },
        ]);
      }
    }
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

  const handleUpdateMarks = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/answerpaper/update-marks`,
        { updatedMarks },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Marks updated successfully!");
      navigate("/teacherDashboard");
    } catch (error) {
      console.error("Error updating marks:", error);
      alert("Failed to update marks.");
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
    updateButton: {
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

  if (isLoading) {
    return <Typography style={{ color: "white" }}>Loading...</Typography>;
  }

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
          Update Marks
        </Typography>
      </div>

      <Grid container spacing={4}>
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
                height="600px"
                style={{ border: "none" }}
                title="PDF Viewer"
              />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
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
                  value={marksArray[currentQuestionIndex]?.marksObtained || ""}
                  onChange={handleMarkChange}
                  className="mb-4"
                  sx={{
                    ...darkThemeStyles.textField,
                    "& .MuiInputBase-root": {
                      backgroundColor: updatedMarks.some(
                        (mark) =>
                          mark.id === marksArray[currentQuestionIndex]?._id
                      )
                        ? "rgba(76, 175, 80, 0.2)"
                        : darkThemeStyles.textField.backgroundColor,
                    },
                  }}
                  slotProps={{
                    input: {
                      min: 0,
                      max: questions[currentQuestionIndex]?.maxMarks,
                    },
                  }}
                  error={
                    marksArray[currentQuestionIndex]?.marksObtained >
                    questions[currentQuestionIndex]?.maxMarks
                  }
                  helperText={
                    marksArray[currentQuestionIndex]?.marksObtained >
                    questions[currentQuestionIndex]?.maxMarks
                      ? `Marks cannot exceed ${questions[currentQuestionIndex]?.maxMarks}`
                      : ""
                  }
                />

                <Button
                  variant="contained"
                  style={darkThemeStyles.updateButton}
                  onClick={handleUpdateMarks}
                  className="w-full"
                >
                  Update Marks
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default UpdateMarks;
