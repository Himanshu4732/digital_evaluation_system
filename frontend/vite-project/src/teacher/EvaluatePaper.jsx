import React, { useState } from "react";
import axios from "axios";
import { Paper, Typography, TextField, Button } from "@mui/material";
import { useParams } from "react-router-dom";

const EvaluatePaper = () => {
  const { id } = useParams();
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/teacher/evaluate-paper/${id}`,
        { marks, feedback },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Paper evaluated successfully!");
    } catch (error) {
      console.error("Error evaluating paper", error);
      alert("Failed to evaluate paper.");
    }
  };

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <Typography variant="h4" className="mb-6 text-blue-400">
        Evaluate Paper
      </Typography>

      <Paper elevation={10} style={{ backgroundColor: "#1e1e1e" }} className="p-6">
        <TextField
          fullWidth
          label="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          margin="normal"
          className="bg-zinc-700"
        />
        <TextField
          fullWidth
          label="Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          margin="normal"
          className="bg-zinc-700"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} className="mt-4">
          Submit Evaluation
        </Button>
      </Paper>
    </div>
  );
};

export default EvaluatePaper;