import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, Grid, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PendingPaper = () => {
  const [pendingPapers, setPendingPapers] = useState([]);
  const [groupedPapers, setGroupedPapers] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const navigate = useNavigate();

  const fetchPendingPapers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/teacher/pendingPaper`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPendingPapers(response.data);
      groupPapersBySection(response.data);
    } catch (error) {
      console.error("Error fetching pending papers", error);
    }
  };

  const groupPapersBySection = (papers) => {
    const grouped = {};
    papers.forEach((paper) => {
      const section = paper.student.section.sectionName;
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

  useEffect(() => {
    fetchPendingPapers();
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
    checkButton: {
      color: "white",
      backgroundColor: "#4caf50",
      "&:hover": {
        backgroundColor: "#388e3c",
      },
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      accent: "#64b5f6",
    },
  };

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <div className="flex items-center mb-6 gap-4">
        <Button
          variant="contained"
          style={darkThemeStyles.button}
          onClick={() => navigate("/teacherDashboard")}
          startIcon={<ArrowBackIcon />}
        >
          Dashboard
        </Button>
        <Typography variant="h4" style={{ color: darkThemeStyles.text.accent }}>
          Pending Papers
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
          </div>

          <Grid container spacing={3}>
            {groupedPapers[selectedSection].map((paper) => (
              <Grid item xs={12} sm={6} md={4} key={paper._id}>
                <Paper elevation={10} style={darkThemeStyles.paper} className="p-6">
                  <Typography variant="h6" style={{ color: darkThemeStyles.text.accent }}>
                    Subject: {paper.subject.subjectName}
                  </Typography>
                  <Typography variant="body1" style={{ color: darkThemeStyles.text.primary }}>
                    Student: {paper.student.email}
                  </Typography>
                  <Typography variant="body2" style={{ color: darkThemeStyles.text.secondary }}>
                    Status: {paper.status}
                  </Typography>
                  <Button
                    variant="contained"
                    style={darkThemeStyles.checkButton}
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
        </>
      )}
    </div>
  );
};

export default PendingPaper;