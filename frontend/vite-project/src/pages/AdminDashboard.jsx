import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid2 } from "@mui/material";
import Navbar from "../components/Navbar";
import AnswerPapersStatus from "../components/AnswerPaperStatus";
import FeedbackStatus from "../components/FeedbackStatus";
import StatCard from "../components/StatCard";
import Fileupload from "../components/Fileupload";
import FileUploadAnswerPaper from "../components/FileUploadAnswerPaper";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admin/dashboard",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-800 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 w-full h-screen text-white overflow-y-auto">
      <Navbar />
      <div className="dashboard-container p-8 py-40">
        <Grid2 container spacing={3} columns={12}>
          {/* Fileupload Section */}
          <Grid2   spacing={1} size={4} container columns={4}>
            <Grid2 items size={2}>
            <Fileupload />
            </Grid2>
            <Grid2 items size={2}>
            <FileUploadAnswerPaper />
            </Grid2>
            
            
          </Grid2>

          {/* StatCard Section */}
          <Grid2 item xs={12} md={8}>
            <StatCard data={dashboardData} />
          </Grid2>
          

          {/* AnswerPapersStatus Section */}
          <Grid2 item xs={12} md={6}>
            <AnswerPapersStatus data={dashboardData.answerPapersStatus} />
          </Grid2>

          {/* FeedbackStatus Section */}
          <Grid2 item xs={12} md={6}>
            <FeedbackStatus data={dashboardData.feedbackMessagesStatus} />
          </Grid2>
        </Grid2>
      </div>
    </div>
  );
};

export default AdminDashboard;