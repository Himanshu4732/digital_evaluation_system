import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  CircularProgress,
  Box
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from "../components/Navbar";

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examLoading, setExamLoading] = useState(true);
  const navigate = useNavigate();

  const darkThemeStyles = {
    paper: {
      backgroundColor: "#1e1e1e",
      color: "white",
      height: "100%"
    },
    button: {
      color: "white",
      backgroundColor: "#1976d2",
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    },
    select: {
      color: "white",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255, 255, 255, 0.23)",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255, 255, 255, 0.5)",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2",
      }
    },
    listItem: {
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      }
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      accent: "#64b5f6",
    }
    ,menuPaper: {
      backgroundColor: "#1e1e1e",
      color: "white",
      "& .MuiMenuItem-root": {
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.58)",
        },
        "&.Mui-selected": {
          backgroundColor: "rgba(25, 118, 210, 0.56)",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "rgba(25, 118, 210, 0.64)",
        }
      }
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exam/all`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setExamLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExam) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/exam/data/${selectedExam}`,
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
    <div className="bg-zinc-800 min-h-screen text-white">
      <Navbar />
      <div className="p-8 pt-24">

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper elevation={10} style={darkThemeStyles.paper} className="p-6">
              <Typography variant="h6" className="mb-4" style={{ color: darkThemeStyles.text.accent }}>
                Select Exam
              </Typography>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth className="mb-4">
                  <InputLabel style={{ color: darkThemeStyles.text.secondary }}>Exam</InputLabel>
                  <Select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    style={darkThemeStyles.select}
                    label="Exam"
                    disabled={examLoading}
                    MenuProps={{
                      PaperProps: {
                        style: darkThemeStyles.menuPaper
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em style={{ color: darkThemeStyles.text.secondary }}>Select an exam</em>
                    </MenuItem>
                    {exams.map((exam) => (
                      <MenuItem 
                        key={exam._id} 
                        value={exam._id} 
                        style={{ color: darkThemeStyles.text.primary }}
                      >
                        {exam.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  style={darkThemeStyles.button}
                  className="w-full"
                  disabled={loading || !selectedExam}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? "Loading Subjects" : "View Subjects"}
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper elevation={10} style={darkThemeStyles.paper} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" style={{ color: darkThemeStyles.text.accent }}>
                  Available Subjects
                </Typography>
                {selectedExam && (
                  <Typography variant="caption" style={{ color: darkThemeStyles.text.secondary }}>
                    {subjects.length} subject(s) found
                  </Typography>
                )}
              </div>

              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress style={{ color: darkThemeStyles.text.accent }} />
                </Box>
              ) : subjects.length === 0 ? (
                <Typography 
                  variant="body1" 
                  className="text-center py-8" 
                  style={{ color: darkThemeStyles.text.secondary }}
                >
                  {selectedExam 
                    ? "No subjects available for this exam" 
                    : "Please select an exam to view subjects"}
                </Typography>
              ) : (
                <List>
                  {subjects.map((subject) => (
                    <React.Fragment key={subject._id}>
                      <ListItem
                        button
                        onClick={() => handleSubjectClick(subject._id)}
                        style={darkThemeStyles.listItem}
                      >
                        <ListItemText
                          primary={
                            <Typography style={{ color: darkThemeStyles.text.primary }}>
                              {subject.subject.subjectName}
                            </Typography>
                          }
                          secondary={
                            <Typography style={{ color: darkThemeStyles.text.secondary }}>
                              Status: {subject.status || "Not attempted"}
                            </Typography>
                          }
                        />
                        <ArrowForwardIcon style={{ color: darkThemeStyles.text.secondary }} />
                      </ListItem>
                      <Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }} />
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