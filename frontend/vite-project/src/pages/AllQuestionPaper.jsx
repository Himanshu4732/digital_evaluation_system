import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, IconButton, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const AllQuestionPaper = () => {
  const [questionPapers, setQuestionPapers] = useState([]);

  const fetchQuestionPapers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/questionPaper/all", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuestionPapers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching question papers", error);
    }
  };

  useEffect(() => {
    fetchQuestionPapers();
  }, []);

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

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <Typography variant="h4" className="mb-6 text-blue-400">
        All Question Papers
      </Typography>

      <Grid container spacing={3}>
        {questionPapers.map((paper) => (
          <Grid item xs={12} sm={6} md={4} key={paper._id}>
            <Paper elevation={3} className="p-6 bg-zinc-700 relative">
              <IconButton
                className="absolute top-2 right-2 text-white"
                onClick={() => handleDeleteQuestionPaper(paper._id)}
              >
                <DeleteIcon />
              </IconButton>

              <Typography variant="h6" className="text-blue-400">
                Subject: {paper.subject.subjectname}
              </Typography>
              <Typography variant="body1" className="text-blue-400">
                Exam: {paper.exam.examType}
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
    </div>
  );
};

export default AllQuestionPaper;