import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Grid, Paper, Typography, Button, MenuItem, FormControl, InputLabel, Select, List, ListItem, ListItemText, Divider } from "@mui/material";
import Navbar from "../components/Navbar";

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/exam/all", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/exam/data/${selectedExam}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/student/subject/${subjectId}`);
  };

  return (
    <div className="bg-zinc-800 w-full h-screen text-white overflow-y-auto">
      <Navbar />
      <div className="dashboard-container p-8 pb-4 py-40">
        <Grid container spacing={3} columns={12}>
          <Grid item xs={12} md={4}>
            <Paper elevation={10} className="p-4" style={{ backgroundColor: "rgb(50,50,50)" }}>
              <Typography variant="h6" className="text-blue-500 uppercase font-semibold mb-4">
                Select Exam
              </Typography>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth className="mb-4">
                  <InputLabel className="text-white">Exam</InputLabel>
                  <Select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="text-white"
                    required
                  >
                    <MenuItem value="">
                      <em className="text-gray-400">Select an exam</em>
                    </MenuItem>
                    {exams.map((exam) => (
                      <MenuItem key={exam._id} value={exam._id} className="text-white">
                        {exam.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Get Data"}
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={10} className="p-4" style={{ backgroundColor: "rgb(50,50,50)" }}>
              <Typography variant="h6" className="text-blue-500 uppercase font-semibold mb-4">
                Subjects
              </Typography>
              {loading ? (
                <Typography className="text-gray-400">Loading...</Typography>
              ) : subjects.length === 0 ? (
                <Typography className="text-gray-400">
                  No subjects available. Please select an exam.
                </Typography>
              ) : (
                <List>
                  {subjects.map((subject) => (
                    <React.Fragment key={subject._id}>
                      <ListItem
                        button
                        onClick={() => handleSubjectClick(subject._id)}
                        className="hover:bg-zinc-700"
                      >
                        <ListItemText
                          primary={<span className="text-white">{subject.subject.subjectName}</span>}
                          secondary={<span className="text-gray-400">{subject.status || "No description"}</span>}
                        />
                      </ListItem>
                      <Divider className="bg-gray-600" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default StudentDashboard;