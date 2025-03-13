import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, Typography, TextField, Button, Grid, IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"; // Import back arrow icon
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Import forward arrow icon

const EvaluateAnswerSheet = () => {
  const { answerSheetId } = useParams(); // Extract answerSheetId from the URL
  const [questions, setQuestions] = useState([]); // List of questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Current question index
  const [marksArray, setMarksArray] = useState([]); // Array to store marks for each question
  const [answerSheetUrl, setAnswerSheetUrl] = useState(""); // URL of the answer sheet from Cloudinary
  const [marksSubmitted, setMarksSubmitted] = useState(false); // Flag to indicate if marks have been submitted

  // Fetch the answer sheet and questions
  useEffect(() => {
    const fetchAnswerSheetAndQuestions = async () => {
      try {
        // Fetch the answer sheet details (including Cloudinary URL)
        const answerSheetResponse = await axios.get(
          `http://localhost:8000/answerpaper/${answerSheetId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setAnswerSheetUrl(answerSheetResponse.data.answerSheet); // Assuming the URL is stored in `answerSheet`
        console.log(answerSheetResponse);
        if(answerSheetResponse.data.status === "Evaluated") {
          setMarksSubmitted(true);
        }

        // Check if the answer sheet is already evaluated
        if (answerSheetResponse.data.status === "Evaluated") {
          setMarksSubmitted(true);
          setMarksArray(answerSheetResponse.data.marksArray || []); // Load existing marks if already evaluated
        }

        // Fetch the questions for the answer sheet
        const questionsResponse = await axios.get(
          `http://localhost:8000/questionPaper/67be80e677afddf8c135052b`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setQuestions(questionsResponse.data.questions);
        console.log(questionsResponse.data);
      } catch (error) {
        console.error("Error fetching answer sheet or questions:", error);
      }
    };

    fetchAnswerSheetAndQuestions();
  }, [answerSheetId]);

  // Handle mark input change
  const handleMarkChange = (event) => {
    const newMarksArray = [...marksArray];
    newMarksArray[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex]._id,
      obtainMarks: parseInt(event.target.value, 10),
    };
    setMarksArray(newMarksArray);
    console.log(marksArray);
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle submit marks
  const handleSubmitMarks = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/answerpaper/check/${answerSheetId}`,
        {
          marksArray,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Marks submitted successfully!");
      setMarksSubmitted(true); // Disable editing after submission
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting marks:", error);
      alert("Failed to submit marks.");
    }
  };

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <Typography variant="h4" className="mb-6 text-blue-400">
        Evaluate Answer Sheet
      </Typography>

      <Grid container spacing={4}>
        {/* Left-hand side: Answer Sheet */}
        <Grid item xs={12} md={6}>
          <Paper elevation={10} style={{ backgroundColor: "#1e1e1e" }} className="p-6">
            <Typography variant="h6" className="text-blue-400 mb-4">
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

        {/* Right-hand side: Question and Marks Input */}
        <Grid item xs={12} md={6}>
          <Paper elevation={10} style={{ backgroundColor: "#1e1e1e" }} className="p-6">
            {/* Navigation Arrows */}
            <div className="flex justify-between items-center mb-4">
              <IconButton
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="text-blue-400"
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography variant="h6" className="text-blue-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
              <IconButton
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="text-blue-400"
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </div>

            {questions.length > 0 && (
              <>
                <Typography variant="body1" className="text-white mb-4">
                  {questions[currentQuestionIndex].questionText}
                </Typography>

                <TextField
                  fullWidth
                  label="Enter Marks"
                  type="number"
                  value={marksArray[currentQuestionIndex]?.obtainMarks || ""}
                  onChange={handleMarkChange}
                  className="mb-4"
                  disabled={marksSubmitted} // Disable input after submission
                />

                {!marksSubmitted && currentQuestionIndex === questions.length - 1 && (
                  <Button
                    variant="contained"
                    color="secondary"
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