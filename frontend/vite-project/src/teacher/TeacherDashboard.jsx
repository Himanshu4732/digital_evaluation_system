import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Paper, Typography, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import StatsCard from "./StatsCard";

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/teacher/dashboard", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDashboardData(response.data);
        console.log(response.data);
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
      <div className="dashboard-container p-8 pb-4 py-40">
        <Grid container spacing={3} columns={12}>
          {/* Quick Links Section */}
          <Grid item xs={12} md={4}>
            <Link to="/teacher/assigned-papers">
              <Paper elevation={10} className="p-4" style={{ cursor: "pointer", backgroundColor: "rgb(50,50,50)", alignItems: "center" }}>
                <h1 className="text-blue-500 uppercase w-full font-semibold">Assigned Papers</h1>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Link to="/teacher/evaluated-papers">
              <Paper elevation={10} className="p-4" style={{ cursor: "pointer", backgroundColor: "rgb(50,50,50)", alignItems: "center" }}>
                <h1 className="text-blue-500 uppercase w-full font-semibold">Evaluated Papers</h1>
              </Paper>
            </Link>
          </Grid>
          {/* StatCard Section */}
          <Grid item xs={12} md={8}>
            <StatsCard data={dashboardData} />
          </Grid>

        
        </Grid>
      </div>
    </div>
  );
};

export default TeacherDashboard;