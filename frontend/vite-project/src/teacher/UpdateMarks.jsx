import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, Typography, TextField, Button, Grid, IconButton } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const UpdateMarks = () => {
  const { answerSheetId } = useParams(); // Extract answerSheetId from the URL
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]); // List of questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Current question index
  const [marksArray, setMarksArray] = useState([]); // Array to store marks for each question
  const [answerSheetUrl, setAnswerSheetUrl] = useState(""); // URL of the answer sheet from Cloudinary
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [updatedMarks, setUpdatedMarks] = useState([]); // Track updated marks

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
        setMarksArray(answerSheetResponse.data.marks || []); // Load existing marks

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
        setIsLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching answer sheet or questions:", error);
        setIsLoading(false); // Stop loading even if there's an error
      }
    };

    fetchAnswerSheetAndQuestions();
  }, [answerSheetId]);

  // Handle mark input change
  const handleMarkChange = (event) => {
    const newMarksArray = [...marksArray];
    const updatedMark = {
      id: newMarksArray[currentQuestionIndex]._id, // Include the mark ID
      obtainMarks: parseInt(event.target.value, 10),
    };

    // Update the marks array
    newMarksArray[currentQuestionIndex].marksObtained = updatedMark.obtainMarks;
    setMarksArray(newMarksArray);

    // Track updated marks
    const existingUpdateIndex = updatedMarks.findIndex(
      (mark) => mark.id === updatedMark.id
    );
    if (existingUpdateIndex !== -1) {
      // Update existing entry
      const newUpdatedMarks = [...updatedMarks];
      newUpdatedMarks[existingUpdateIndex] = updatedMark;
      setUpdatedMarks(newUpdatedMarks);
    } else {
      // Add new entry
      setUpdatedMarks([...updatedMarks, updatedMark]);
    }
    console.log(updatedMarks);
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

  // Handle update marks
  const handleUpdateMarks = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/answerpaper/update-marks`,
        {
          updatedMarks, // Send only the updated marks
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Marks updated successfully!");
      navigate("/teacher/dashboard"); // Redirect to the teacher's dashboard
      console.log(response.data);
    } catch (error) {
      console.error("Error updating marks:", error);
      alert("Failed to update marks.");
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <Typography variant="h4" className="mb-6 text-blue-400">
        Update Marks
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
                  value={marksArray[currentQuestionIndex]?.marksObtained || ""}
                  onChange={handleMarkChange}
                  className="mb-4"
                  InputProps={{
                    style: {
                      backgroundColor: updatedMarks.some(
                        (mark) => mark.id === marksArray[currentQuestionIndex]?._id
                      )
                        ? "#4CAF50" // Green background for updated marks
                        : "inherit", // Default background
                    },
                  }}
                />

                <Button
                  variant="contained"
                  color="secondary"
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