import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Button, Grid2, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from "@mui/icons-material/Close"; // For the cross mark

const AdminExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newExam, setNewExam] = useState({
    examType: "",
    dateOfExam: null,
    subjectWiseData: [],
  });

  // Fetch exams from the backend
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
        console.error("Error fetching exams", error);
      }
    };

    fetchExams();
  }, []);

  // Sort exams by year
  const sortedExams = exams.sort((a, b) => new Date(b.dateOfExam) - new Date(a.dateOfExam));

  // Handle add exam dialog open
  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  // Handle add exam dialog close
  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewExam({
      examType: "",
      dateOfExam: null,
      subjectWiseData: [],
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExam({ ...newExam, [name]: value });
  };

  // Handle date change
  const handleDateChange = (date) => {
    setNewExam({ ...newExam, dateOfExam: date });
  };

  // Handle add exam submission
  const handleAddExam = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/exam/add",
        newExam,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExams([...exams, response.data]);
      handleAddDialogClose();
    } catch (error) {
      console.error("Error adding exam", error);
    }
  };

  // Handle delete exam
  const handleDeleteExam = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/exam/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExams(exams.filter((exam) => exam._id !== id));
    } catch (error) {
      console.error("Error deleting exam", error);
    }
  };

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <Typography variant="h4" className="mb-6 text-blue-400">
        Exam Management
      </Typography>

      {/* Add Exam Button */}
      <Button variant="contained" color="primary" onClick={handleAddDialogOpen} className="mb-6">
        Add New Exam
      </Button>

      {/* Exams Grid2 */}
      <Grid2 container spacing={3}>
        {sortedExams.map((exam) => (
          <Grid2 item xs={12} sm={6} md={4} key={exam._id}>
            <Paper elevation={3} className="p-6 bg-zinc-700 relative">
              {/* Delete Button (Cross Mark) */}
              <IconButton
                className="absolute top-2 right-2 text-white"
                onClick={() => handleDeleteExam(exam._id)}
              >
                <CloseIcon />
              </IconButton>

              {/* Exam Details */}
              <Typography variant="h6" className="text-blue-400">
                {exam.examType}
              </Typography>
              <Typography variant="body1" className="text-white">
                Date: {new Date(exam.dateOfExam).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" className="text-zinc-400">
                Subjects: {exam.subjectWiseData.length}
              </Typography>
            </Paper>
          </Grid2>
        ))}
      </Grid2>

      {/* Add Exam Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>Add New Exam</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TextField
              name="examType"
              label="Exam Type"
              select
              fullWidth
              margin="normal"
              value={newExam.examType}
              onChange={handleInputChange}
            >
              <option value="midterm">Midterm</option>
              <option value="endterm">Endterm</option>
            </TextField>
            <DatePicker
              label="Date of Exam"
              value={newExam.dateOfExam}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleAddExam} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminExamsPage;