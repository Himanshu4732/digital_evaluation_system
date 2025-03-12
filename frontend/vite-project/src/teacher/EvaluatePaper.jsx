import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, Typography, TextField, Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf"; // Import react-pdf components
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Optional: For text layer styling
import "react-pdf/dist/esm/Page/TextLayer.css"; // Optional: For annotation layer styling


// Use the latest version of PDF.js from the CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const EvaluateAnswerSheet = () => {
  const { answerSheetId } = useParams(); // Extract answerSheetId from the URL
  const [questions, setQuestions] = useState([]); // List of questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Current question index
  const [marksArray, setMarksArray] = useState([]); // Array to store marks for each question
  const [answerSheetUrl, setAnswerSheetUrl] = useState(""); // URL of the answer sheet from Cloudinary
  const [numPages, setNumPages] = useState(null); // Total number of pages in the PDF
  const [pageNumber, setPageNumber] = useState(1); // Current page number

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

        // Fetch the questions for the answer sheet
        const questionsResponse = await axios.get(
          `http://localhost:8000/questions/${answerSheetResponse.data.examId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setQuestions(questionsResponse.data);
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
      mark: parseInt(event.target.value, 10),
    };
    setMarksArray(newMarksArray);
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle submit marks
  const handleSubmitMarks = async () => {
    try {
      const studentId = "studentId"; // Replace with actual student ID from the answer sheet
      const response = await axios.post(
        "http://localhost:8000/marks/submit",
        {
          studentId,
          answerSheetId,
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
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting marks:", error);
      alert("Failed to submit marks.");
    }
  };

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
              <Document
                file={answerSheetUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Typography>Loading PDF...</Typography>}
              >
                <Page pageNumber={pageNumber} width={500} />
              </Document>
            )}
            {numPages && (
              <div className="mt-4">
                <Button
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber(pageNumber - 1)}
                  variant="contained"
                  color="primary"
                  className="mr-2"
                >
                  Previous
                </Button>
                <Button
                  disabled={pageNumber >= numPages}
                  onClick={() => setPageNumber(pageNumber + 1)}
                  variant="contained"
                  color="primary"
                >
                  Next
                </Button>
              </div>
            )}
          </Paper>
        </Grid>

        {/* Right-hand side: Question and Marks Input */}
        <Grid item xs={12} md={6}>
          <Paper elevation={10} style={{ backgroundColor: "#1e1e1e" }} className="p-6">
            <Typography variant="h6" className="text-blue-400 mb-4">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>

            {questions.length > 0 && (
              <>
                <Typography variant="body1" className="text-white mb-4">
                  {questions[currentQuestionIndex].questionText}
                </Typography>

                <TextField
                  fullWidth
                  label="Enter Marks"
                  type="number"
                  value={marksArray[currentQuestionIndex]?.mark || ""}
                  onChange={handleMarkChange}
                  className="mb-4"
                />

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button variant="contained" color="primary" onClick={handleNextQuestion}>
                    Next Question
                  </Button>
                ) : (
                  <Button variant="contained" color="secondary" onClick={handleSubmitMarks}>
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