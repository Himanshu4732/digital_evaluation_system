import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import AnswerPapersStatus from "../components/AnswerPaperStatus";
import FeedbackStatus from "../components/FeedbackStatus";
import StatCard from "../components/StatCard";

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
    <div className="bg-zinc-800 w-full h-screen text-white">
      <Navbar />
      <div className="dashboard-container p-8 ">
        <Typography variant="h3" className="text-center mb-4 text-blue-400 ">
          Admin Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          className="text-center text-zinc-400 mb-8"
        >
          Welcome back! Here's an overview of your system's performance.
        </Typography>

        {/* Stat Cards */}
        <StatCard data={dashboardData} />

        <div className="flex justify-center gap-8 mt-8">
          <AnswerPapersStatus data={dashboardData.answerPapersStatus} />

          <FeedbackStatus data={dashboardData.feedbackMessagesStatus} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
