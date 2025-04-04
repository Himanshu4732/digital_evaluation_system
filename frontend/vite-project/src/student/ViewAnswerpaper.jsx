import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Paper, 
  Typography, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ViewAnswerpaper = () => {
  const { answerSheetId } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [answerSheetUrl, setAnswerSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalMarks, setTotalMarks] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const answerSheetResponse = await axios.get(
          `http://localhost:8000/answerpaper/${answerSheetId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setAnswerSheetUrl(answerSheetResponse.data.answerSheet);
        const initialMarks = answerSheetResponse.data.marks || [];
        setMarks(initialMarks);
        setIsLoading(false);
        calculateTotal(initialMarks);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [answerSheetId]);

  const calculateTotal = (marksArray) => {
    const total = marksArray.map(mark => mark.marksObtained || 0).reduce((acc, curr) => acc + curr, 0);
    setTotalMarks(total);
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-800 min-h-screen text-white flex items-center justify-center">
        <Typography variant="h5" className="text-blue-400">
          Loading...
        </Typography>
      </div>
    );
  }

  return (
    <div className=" bg-zinc-800 min-h-screen text-white p-8">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <IconButton onClick={() => navigate(-1)} className="text-blue-400 mr-2">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" className="text-blue-400 font-bold">
          View Answer Paper
        </Typography>
      </div>

      <Grid container spacing={4}>
        {/* Left Side - Answer Sheet */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={10}
            style={{
              backgroundColor: "#1e1e1e",
              borderRadius: "10px",
              overflow: "hidden",
            }}
            className="p-6 h-full"
          >
            <Typography
              variant="h6"
              className="text-blue-400 mb-4 font-semibold"
            >
              Answer Sheet
            </Typography>
            {answerSheetUrl ? (
              <iframe
                src={answerSheetUrl}
                width="100%"
                height="600px"
                style={{
                  border: "2px solid #2c2c2c",
                  borderRadius: "5px",
                }}
                title="Answer Sheet"
              />
            ) : (
              <Typography className="text-gray-400">
                No answer sheet available.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Right Side */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={10}
            style={{
              backgroundColor: "#1e1e1e",
              borderRadius: "10px",
              overflow: "hidden",
            }}
            className="p-6 h-full"
          >
            <Typography
              variant="h6"
              className="text-blue-400 mb-4 font-semibold"
            >
              Marks Entry
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "#9ca3af", fontWeight: "bold" }}>
                      Q.No
                    </TableCell>
                    <TableCell style={{ color: "#9ca3af", fontWeight: "bold" }}>
                      Max Marks
                    </TableCell>
                    <TableCell style={{ color: "#9ca3af", fontWeight: "bold" }}>
                      Marks Obtained
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marks.map((mark, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ color: "#e5e7eb" }}>
                        {mark.questionNumber || index + 1}
                      </TableCell>
                      <TableCell style={{ color: "#e5e7eb" }}>
                        {mark.maxMarks}
                      </TableCell>
                      <TableCell style={{ color: "#e5e7eb" }}>
                        {mark.marksObtained || ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="mt-4 flex justify-between items-center">
              <Typography
                variant="h6"
                style={{ color: "#9ca3af", fontWeight: "bold" }}
              >
                Total Marks: {totalMarks}
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewAnswerpaper;