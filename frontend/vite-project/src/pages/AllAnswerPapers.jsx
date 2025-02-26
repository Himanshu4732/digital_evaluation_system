import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, Grid, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const AllAnswerPapers = () => {
  const [answerPapers, setAnswerPapers] = useState([]);

  const fetchAnswerPapers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/answerpaper/all", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Fetched answer papers:", response.data);
      setAnswerPapers(response.data);
    } catch (error) {
      console.error("Error fetching answer papers", error);
    }
  };

  useEffect(() => {
    fetchAnswerPapers();
  }, []);

  const handleDeleteAnswerPaper = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/answer-paper/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAnswerPapers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting answer paper", error);
    }
  };

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <Typography variant="h4" className="mb-6 text-blue-400">
        All Answer Papers
      </Typography>

      <Grid container spacing={3}>
        {answerPapers.map((paper) => (
          <Grid item xs={12} sm={6} md={4} key={paper._id}>
            <Paper elevation={3} className="p-6 bg-zinc-700 relative">
              <IconButton
                className="absolute top-2 right-2 text-white"
                onClick={() => handleDeleteAnswerPaper(paper._id)}
              >
                <DeleteIcon />
              </IconButton>

              <Typography variant="h6" className="text-blue-400">
                Subject: {paper.subject.subjectname}
              </Typography>
              <Typography variant="body1" className="text-white">
                Exam: {paper.exam.examType} ({new Date(paper.exam.dateOfExam).toLocaleDateString()})
              </Typography>
              <Typography variant="body2" className="text-zinc-400">
                Student: {paper.student.email}
              </Typography>
              <Typography variant="body2" className="text-zinc-400">
                Status: {paper.status}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/answer-paper/${paper._id}`}
                className="mt-4"
              >
                View Details
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AllAnswerPapers;