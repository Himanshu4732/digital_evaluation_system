import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const AllAnswerPapers = () => {
  const [answerPapers, setAnswerPapers] = useState([]); // All answer papers
  const [groupedPapers, setGroupedPapers] = useState({}); // Answer papers grouped by section
  const [selectedSection, setSelectedSection] = useState(null); // Selected section
  const [openAssignDialog, setOpenAssignDialog] = useState(false); // Pop-up for assigning papers
  const [teacherEmail, setTeacherEmail] = useState(""); // Teacher email for assignment

  // Fetch all answer papers
  const fetchAnswerPapers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/answerpaper/allAnswerPaper", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAnswerPapers(response.data);
      console.log(response.data);
      groupPapersBySection(response.data); // Group papers by section
    } catch (error) {
      console.error("Error fetching answer papers", error);
    }
  };

  // Group answer papers by section
  const groupPapersBySection = (papers) => {
    const grouped = {};
    papers.forEach((paper) => {
      const section = paper.student.section; // Assuming `section` is a field in the `student` object
      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(paper);
    });
    setGroupedPapers(grouped);
  };

  // Handle section click
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  // Handle delete answer paper
  const handleDeleteAnswerPaper = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/answerpaper/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAnswerPapers(); 
    } catch (error) {
      console.error("Error deleting answer paper", error);
    }
  };

  // Handle assign answer papers to teacher
  const handleAssignPapers = async () => {
    try {
      for (const paper of groupedPapers[selectedSection]) {
        await axios.patch(
          `http://localhost:8000/answerpaper/assign/${paper._id}`,
          { teacherEmail },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      alert("Answer papers assigned successfully!");
      setOpenAssignDialog(false);
    } catch (error) {
      console.error("Error assigning answer papers", error);
      alert("Failed to assign answer papers.");
    }
  };

  useEffect(() => {
    fetchAnswerPapers();
  }, []);

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <Typography variant="h4" className="mb-6 text-blue-400">
        All Answer Papers
      </Typography>

      {/* Display Sections */}
      {!selectedSection && (
        <Grid container spacing={3}>
          {Object.keys(groupedPapers).map((section) => (
            <Grid item xs={12} sm={6} md={4} key={section}>
              <Paper
                elevation={10}
                style={{ backgroundColor: "#1e1e1e" }}
                className="p-6 text-center cursor-pointer"
                onClick={() => handleSectionClick(section)}
              >
                <Typography variant="h6" className="text-blue-400">
                  Section: {section}
                </Typography>
                <Typography variant="body2" className="text-zinc-400">
                  Papers: {groupedPapers[section].length}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Display Answer Papers for Selected Section */}
      {selectedSection && (
        <>
          <Button variant="contained" color="primary" onClick={() => setOpenAssignDialog(true)} className="mb-6">
            Assign Papers to Teacher
          </Button>

          <Grid container spacing={3}>
            {groupedPapers[selectedSection].map((paper) => (
              <Grid item xs={12} sm={6} md={4} key={paper._id}>
                <Paper elevation={10} style={{ backgroundColor: "#1e1e1e" }} className="p-6 relative">
                  <IconButton
                    style={{ backgroundColor: "maroon", color: "#fff", position: "absolute", top: "10px", right: "10px" }}
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
        </>
      )}

      {/* Assign Papers Pop-up */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
        <DialogTitle>Assign Papers to Teacher</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Teacher Email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignPapers} color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllAnswerPapers;