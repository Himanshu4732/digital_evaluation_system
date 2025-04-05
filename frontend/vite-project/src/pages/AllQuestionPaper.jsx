import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, Grid, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../components/Navbar";

const AllQuestionPaper = () => {
  const [questionPapers, setQuestionPapers] = useState([]);
  const [groupedPapers, setGroupedPapers] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);
  const navigate = useNavigate();

  const fetchQuestionPapers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/questionPaper/all", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuestionPapers(response.data);
      groupPapersByExamName(response.data);
    } catch (error) {
      console.error("Error fetching question papers", error);
    }
  };

  const groupPapersByExamName = (papers) => {
    const grouped = {};
    papers.forEach((paper) => {
      const examName = paper.exam.name;
      if (!grouped[examName]) {
        grouped[examName] = [];
      }
      grouped[examName].push(paper);
    });
    setGroupedPapers(grouped);
  };

  const handleExamClick = (examName) => {
    setSelectedExam(examName);
  };

  const handleDeleteQuestionPaper = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/admin/question-papers/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchQuestionPapers();
    } catch (error) {
      console.error("Error deleting question paper", error);
    }
  };

  useEffect(() => {
    fetchQuestionPapers();
  }, []);

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
    deleteButton: {
      backgroundColor: "maroon",
      color: "white",
      position: "absolute",
      top: "10px",
      right: "10px",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      accent: "#64b5f6",
    },
  };

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8 pt-32">
      <Navbar />
      <div className="flex items-center mb-6 gap-4">
        <Button
          variant="contained"
          style={darkThemeStyles.button}
          onClick={() => navigate("/adminDashboard")}
          startIcon={<ArrowBackIcon />}
        >
          Dashboard
        </Button>
        <Typography variant="h4" style={{ color: darkThemeStyles.text.accent }}>
          All Question Papers
        </Typography>
      </div>

      {!selectedExam && (
        <Grid container spacing={3}>
          {Object.keys(groupedPapers).map((examName) => (
            <Grid item xs={12} sm={6} md={4} key={examName}>
              <Paper
                elevation={10}
                style={darkThemeStyles.paper}
                className="p-6 text-center cursor-pointer hover:bg-zinc-700 transition-colors"
                onClick={() => handleExamClick(examName)}
              >
                <Typography variant="h6" style={{ color: darkThemeStyles.text.accent }}>
                  Exam: {examName}
                </Typography>
                <Typography variant="body2" style={{ color: darkThemeStyles.text.secondary }}>
                  Papers: {groupedPapers[examName].length}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedExam && (
        <>
          <div className="flex gap-4 mb-6">
            <IconButton
              style={darkThemeStyles.button}
              onClick={() => setSelectedExam(null)}
            >
              <ArrowBackIcon />
            </IconButton>
          </div>

          <Grid container spacing={3}>
            {groupedPapers[selectedExam].map((paper) => (
              <Grid item xs={12} sm={6} md={4} key={paper._id}>
                <Paper elevation={10} style={darkThemeStyles.paper} className="p-6 relative">
                  <IconButton
                    style={darkThemeStyles.deleteButton}
                    onClick={() => handleDeleteQuestionPaper(paper._id)}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <Typography variant="h6" style={{ color: darkThemeStyles.text.accent }}>
                    Subject: {paper.subject.subjectname}
                  </Typography>
                  <Typography variant="body1" style={{ color: darkThemeStyles.text.primary }}>
                    Exam: {paper.exam.name} ({new Date(paper.exam.dateOfExam).toLocaleDateString()})
                  </Typography>
                  <Typography variant="body2" style={{ color: darkThemeStyles.text.secondary }}>
                    Total Marks: {paper.total_marks}
                  </Typography>

                  <Button
                    variant="contained"
                    style={darkThemeStyles.button}
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