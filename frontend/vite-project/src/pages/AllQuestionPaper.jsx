import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, IconButton, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar";

const AllQuestionPaper = () => {
  const [questionPapers, setQuestionPapers] = useState([]); // All question papers
  const [groupedPapers, setGroupedPapers] = useState({}); // Question papers grouped by exam type
  const [selectedExam, setSelectedExam] = useState(null); // Selected exam type

  // Fetch all question papers
  const fetchQuestionPapers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/questionPaper/all", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuestionPapers(response.data);
      groupPapersByexamname(response.data); // Group papers by exam type
    } catch (error) {
      console.error("Error fetching question papers", error);
    }
  };

  // Group question papers by exam type
  const groupPapersByexamname = (papers) => {
    const grouped = {};
    papers.forEach((paper) => {
      const examname = paper.exam.name; // Assuming `examname` is a field in the `exam` object
      if (!grouped[examname]) {
        grouped[examname] = [];
      }
      grouped[examname].push(paper);
    });
    setGroupedPapers(grouped);
  };

  // Handle exam type click
  const handleExamClick = (examname) => {
    setSelectedExam(examname);
  };

  // Handle delete question paper
  const handleDeleteQuestionPaper = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/admin/question-papers/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchQuestionPapers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting question paper", error);
    }
  };

  useEffect(() => {
    fetchQuestionPapers();
  }, []);

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8 pt-32">
      <Navbar />
      <Typography variant="h4" className="mb-6 text-blue-400">
        All Question Papers
      </Typography>

      {/* Display Exam Types */}
      {!selectedExam && (
        <Grid container spacing={3}>
          {Object.keys(groupedPapers).map((examname) => (
            <Grid item xs={12} sm={6} md={4} key={examname}>
              <Paper
                elevation={10}
                style={{ backgroundColor: "#1e1e1e" }}
                className="p-6 text-center cursor-pointer"
                onClick={() => handleExamClick(examname)}
              >
                <Typography variant="h6" className="text-blue-400">
                  Exam name: {examname}
                </Typography>
                <Typography variant="body2" className="text-zinc-400">
                  Papers: {groupedPapers[examname].length}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Display Question Papers for Selected Exam */}
      {selectedExam && (
        <>
          <Button variant="contained" color="primary" onClick={() => setSelectedExam(null)} className="mb-6">
            Back to Exam Types
          </Button>

          <Grid container spacing={3}>
            {groupedPapers[selectedExam].map((paper) => (
              <Grid item xs={12} sm={6} md={4} key={paper._id}>
                <Paper elevation={10} style={{ backgroundColor: "#1e1e1e" }} className="p-6 relative">
                  <IconButton
                    style={{ backgroundColor: "maroon", color: "#fff", position: "absolute", top: "10px", right: "10px" }}
                    onClick={() => handleDeleteQuestionPaper(paper._id)}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <Typography variant="h6" className="text-blue-400">
                    Subject: {paper.subject.subjectname}
                  </Typography>
                  <Typography variant="body1" className="text-white">
                    Exam: {paper.exam.examname} ({new Date(paper.exam.dateOfExam).toLocaleDateString()})
                  </Typography>
                  <Typography variant="body2" className="text-zinc-400">
                    Total Marks: {paper.total_marks}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/question-paper/${paper._id}`}
                    className="mt-4"
                  >
                    Manage Questions
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default AllQuestionPaper;