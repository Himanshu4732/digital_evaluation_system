import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, Grid, IconButton } from "@mui/material";
import { Link } from "react-router-dom";

const AssignedPapers = () => {
  const [assignedPapers, setAssignedPapers] = useState([]);

  const fetchAssignedPapers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/teacher/assignedPaper", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAssignedPapers(response.data);
    } catch (error) {
      console.error("Error fetching assigned papers", error);
    }
  };

  useEffect(() => {
    fetchAssignedPapers();
  }, []);

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <Typography variant="h4" className="mb-6 text-blue-400">
        Assigned Papers
      </Typography>

      <Grid container spacing={3}>
        {assignedPapers.map((paper) => (
          <Grid item xs={12} sm={6} md={4} key={paper._id}>
            <Paper elevation={10} style={{ backgroundColor: "#1e1e1e" }} className="p-6">
              <Typography variant="h6" className="text-blue-400">
                Subject: {paper.subject.subjectname}
              </Typography>
              <Typography variant="body1" className="text-white">
                Student: {paper.student.email}
              </Typography>
              <Typography variant="body2" className="text-zinc-400">
                Status: {paper.status}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/teacher/evaluate-paper/${paper._id}`}
                className="mt-4"
              >
                Check
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AssignedPapers;