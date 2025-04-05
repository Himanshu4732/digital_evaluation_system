import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AllAnswerPapers = () => {
  const [answerPapers, setAnswerPapers] = useState([]);
  const [groupedPapers, setGroupedPapers] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState("");
  const navigate = useNavigate();

  const fetchAnswerPapers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/answerpaper/allAnswerPaper", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAnswerPapers(response.data);
      groupPapersBySection(response.data);
    } catch (error) {
      console.error("Error fetching answer papers", error);
    }
  };

  const groupPapersBySection = (papers) => {
    const grouped = {};
    papers.forEach((paper) => {
      const section = paper.student.section;
      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(paper);
    });
    setGroupedPapers(grouped);
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

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
    dialog: {
      backgroundColor: "#2d2d2d",
    },
  };

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
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
          All Answer Papers
        </Typography>
      </div>

      {!selectedSection && (
        <Grid container spacing={3}>
          {Object.keys(groupedPapers).map((section) => (
            <Grid item xs={12} sm={6} md={4} key={section}>
              <Paper
                elevation={10}
                style={darkThemeStyles.paper}
                className="p-6 text-center cursor-pointer hover:bg-zinc-700 transition-colors"
                onClick={() => handleSectionClick(section)}
              >
                <Typography variant="h6" style={{ color: darkThemeStyles.text.accent }}>
                  Section: {section}
                </Typography>
                <Typography variant="body2" style={{ color: darkThemeStyles.text.secondary }}>
                  Papers: {groupedPapers[section].length}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedSection && (
        <>
          <div className="flex gap-4 mb-6">
            <IconButton
              style={darkThemeStyles.button}
              onClick={() => setSelectedSection(null)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Button
              variant="contained"
              style={darkThemeStyles.button}
              onClick={() => setOpenAssignDialog(true)}
            >
              Assign Papers to Teacher
            </Button>
          </div>

          <Grid container spacing={3}>
            {groupedPapers[selectedSection].map((paper) => (
              <Grid item xs={12} sm={6} md={4} key={paper._id}>
                <Paper elevation={10} style={darkThemeStyles.paper} className="p-6 relative">
                  <IconButton
                    style={darkThemeStyles.deleteButton}
                    onClick={() => handleDeleteAnswerPaper(paper._id)}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <Typography variant="h6" style={{ color: darkThemeStyles.text.accent }}>
                    Subject: {paper.subject.subjectName}
                  </Typography>
                  <Typography variant="body1" style={{ color: darkThemeStyles.text.primary }}>
                    Exam: {paper.exam.examType} ({new Date(paper.exam.dateOfExam).toLocaleDateString()})
                  </Typography>
                  <Typography variant="body2" style={{ color: darkThemeStyles.text.secondary }}>
                    Student: {paper.student.email}
                  </Typography>
                  <Typography variant="body2" style={{ color: darkThemeStyles.text.secondary }}>
                    Status: {paper.status}
                  </Typography>

                  <Button
                    variant="contained"
                    style={darkThemeStyles.button}
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

      <Dialog
        open={openAssignDialog}
        onClose={() => setOpenAssignDialog(false)}
        PaperProps={{ style: darkThemeStyles.dialog }}
      >
        <DialogTitle style={{ color: darkThemeStyles.text.primary }}>
          Assign Papers to Teacher
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Teacher Email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
            margin="normal"
            InputLabelProps={{ style: { color: darkThemeStyles.text.secondary } }}
            InputProps={{ style: { color: darkThemeStyles.text.primary } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)} style={{ color: darkThemeStyles.text.primary }}>
            Cancel
          </Button>
          <Button onClick={handleAssignPapers} style={{ color: darkThemeStyles.text.accent }}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllAnswerPapers;