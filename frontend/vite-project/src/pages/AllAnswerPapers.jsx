import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";

const AllAnswerPapers = () => {
  const [answerPapers, setAnswerPapers] = useState([]);
  const [groupedPapers, setGroupedPapers] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("section");
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openSingleAssignDialog, setOpenSingleAssignDialog] = useState(false);
  const [bulkTeacherEmail, setBulkTeacherEmail] = useState("");
  const [singleTeacherEmail, setSingleTeacherEmail] = useState("");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const navigate = useNavigate();

  const groupPapers = (papers, criteria) => {
    const grouped = {};
    papers.forEach((paper) => {
      let key;
      switch (criteria) {
        case "section":
          key = paper.student.section;
          break;
        case "exam":
          key = paper.exam.examType;
          break;
        case "status":
          key = paper.status;
          break;
        default:
          key = paper.student.section;
      }
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(paper);
    });
    setGroupedPapers(grouped);
  };

  const fetchAnswerPapers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/answerpaper/allAnswerPaper`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAnswerPapers(response.data);
      groupPapers(response.data, sortCriteria);
    } catch (error) {
      console.error("Error fetching answer papers", error);
    }
  };

  useEffect(() => {
    fetchAnswerPapers();
  }, []);

  useEffect(() => {
    groupPapers(answerPapers, sortCriteria);
  }, [sortCriteria]);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleDeleteAnswerPaper = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/answerpaper/delete/${id}`, {
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

  const handleBulkAssign = async () => {
    try {
      const papersToAssign = groupedPapers[selectedGroup].filter(paper => !paper.teacherEmail);
      for (const paper of papersToAssign) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/answerpaper/assign/${paper._id}`,
          { teacherEmail: bulkTeacherEmail },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      alert(`Assigned ${papersToAssign.length} papers successfully!`);
      setOpenAssignDialog(false);
      setBulkTeacherEmail("");
      fetchAnswerPapers();
    } catch (error) {
      console.error("Error assigning answer papers", error);
      alert("Failed to assign answer papers.");
    }
  };

  const handleSingleAssign = async () => {
    if (!selectedPaper || !singleTeacherEmail) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/answerpaper/assign/${selectedPaper._id}`,
        { teacherEmail: singleTeacherEmail },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Paper assigned successfully!");
      setOpenSingleAssignDialog(false);
      setSingleTeacherEmail("");
      fetchAnswerPapers();
    } catch (error) {
      console.error("Error assigning paper", error);
      alert("Failed to assign paper.");
    }
  };

  const darkThemeStyles = {
    paper: { backgroundColor: "#1e1e1e", color: "white" },
    button: {
      color: "white",
      backgroundColor: "#1976d2",
      "&:hover": { backgroundColor: "#1565c0" },
    },
    deleteButton: {
      backgroundColor: "maroon",
      color: "white",
      position: "absolute",
      top: "10px",
      right: "10px",
    },
    assignButton: {
      backgroundColor: "green",
      color: "white",
      position: "absolute",
      top: "10px",
      right: "60px",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      accent: "#64b5f6",
    },
    dialog: { backgroundColor: "#2d2d2d" },
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
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            style={{
              backgroundColor: darkThemeStyles.paper.backgroundColor,
              color: darkThemeStyles.text.primary,
              padding: "8px",
              borderRadius: "4px",
              border: "none",
            }}
          >
            <option value="section">Section</option>
            <option value="exam">Exam</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {!selectedGroup ? (
        <Grid container spacing={3}>
          {Object.keys(groupedPapers).map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group}>
              <Paper
                elevation={10}
                style={darkThemeStyles.paper}
                className="p-6 text-center cursor-pointer hover:bg-zinc-700 transition-colors"
                onClick={() => handleGroupClick(group)}
              >
                <Typography variant="h6" style={{ color: darkThemeStyles.text.accent }}>
                  {sortCriteria === "section" && "Section: "}
                  {sortCriteria === "exam" && "Exam: "}
                  {sortCriteria === "status" && "Status: "}
                  {group}
                </Typography>
                <Typography variant="body2" style={{ color: darkThemeStyles.text.secondary }}>
                  Papers: {groupedPapers[group].length}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <div className="flex gap-4 mb-6">
            <IconButton style={darkThemeStyles.button} onClick={() => setSelectedGroup(null)}>
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
            {groupedPapers[selectedGroup].map((paper) => (
              <Grid item xs={12} sm={6} md={4} key={paper._id}>
                <Paper elevation={10} style={darkThemeStyles.paper} className="p-6 relative">
                  <IconButton
                    style={darkThemeStyles.deleteButton}
                    onClick={() => handleDeleteAnswerPaper(paper._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    style={darkThemeStyles.assignButton}
                    onClick={() => {
                      setSelectedPaper(paper);
                      setOpenSingleAssignDialog(true);
                    }}
                  >
                    <AssignmentIcon />
                  </IconButton>

                  {/* Paper content remains same */}
                  <Typography variant="h6" style={{ color: darkThemeStyles.text.accent }}>
                    Subject: {paper.subject.subjectName}
                  </Typography>
                  <Typography variant="body1" style={{ color: darkThemeStyles.text.primary }}>
                    Exam: {paper.exam.examType} ({new Date(paper.exam.dateOfExam).toLocaleDateString()})
                  </Typography>
                  <Typography variant="body2" style={{ color: darkThemeStyles.text.secondary }}>
                    Student: {paper.student.email}
                  </Typography>
                  <Typography variant="body2" style={{ 
                    color: paper.status === "Evaluated" ? "green" : 
                           paper.status === "Pending" ? "orange" : 
                           paper.status === "Under_Review" ? "purple" : "red" 
                  }}>
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

      {/* Bulk Assign Dialog */}
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
            value={bulkTeacherEmail}
            onChange={(e) => setBulkTeacherEmail(e.target.value)}
            margin="normal"
            InputLabelProps={{ style: { color: darkThemeStyles.text.secondary } }}
            InputProps={{ style: { color: darkThemeStyles.text.primary } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)} style={{ color: darkThemeStyles.text.primary }}>
            Cancel
          </Button>
          <Button onClick={handleBulkAssign} style={{ color: darkThemeStyles.text.accent }}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Single Assign Dialog */}
      <Dialog
        open={openSingleAssignDialog}
        onClose={() => setOpenSingleAssignDialog(false)}
        PaperProps={{ style: darkThemeStyles.dialog }}
      >
        <DialogTitle style={{ color: darkThemeStyles.text.primary }}>
          Assign Single Paper
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Teacher Email"
            value={singleTeacherEmail}
            onChange={(e) => setSingleTeacherEmail(e.target.value)}
            margin="normal"
            InputLabelProps={{ style: { color: darkThemeStyles.text.secondary } }}
            InputProps={{ style: { color: darkThemeStyles.text.primary } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSingleAssignDialog(false)} style={{ color: darkThemeStyles.text.primary }}>
            Cancel
          </Button>
          <Button onClick={handleSingleAssign} style={{ color: darkThemeStyles.text.accent }}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllAnswerPapers;