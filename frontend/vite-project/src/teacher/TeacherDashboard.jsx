import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid2, Paper, Typography, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import StatsCard from "./StatsCard";
import AnswerPapersStatus from "../components/AnswerPaperStatus";
import FeedbackStatus from "../components/FeedbackStatus";
import WeeklyChart from "../components/WeeklyChart";
import TodayAssignedPapers from "../components/TodayAssignedPapers";

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const answerPapersStatus = {
    'Assigned': 0,
    'Pending': 0,
    'Evaluated': 0
};
     for(const papers in dashboardData){
      const ansStatus = dashboardData[papers].status
      
      answerPapersStatus[ansStatus]++;
     }
  
     const getLast7DaysData = (data) => {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date();
      const last7DaysData = [];
    
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const day = daysOfWeek[date.getDay()];
    
        // Filter papers assigned on this day
        const assignedData = data.filter((item) => {
          const itemDate = new Date(item.assigned_date);
          return (
            itemDate.getFullYear() === date.getFullYear() &&
            itemDate.getMonth() === date.getMonth() &&
            itemDate.getDate() === date.getDate()
          );
        });
    
        // Filter papers evaluated on this day
        const evaluationData = data.filter((item) => {
          const itemDate = new Date(item.evaluation_date);
          return (
            itemDate.getFullYear() === date.getFullYear() &&
            itemDate.getMonth() === date.getMonth() &&
            itemDate.getDate() === date.getDate()
          );
        });
    
        // Push the day's data
        last7DaysData.push({
          day,
          assigned: assignedData.length, // Number of papers assigned
          evaluated: evaluationData.length, // Number of papers evaluated
        });
      }
    
      return last7DaysData;
    };

    const getTodaysAssignedPapers = (data) => {
      const today = new Date(); // Get today's date
      const todaysDateString = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    
      // Filter papers assigned today
      const todaysAssignedPapers = data.filter((item) => {
        if (!item.assigned_date) return false; // Skip if no date exists
        
        // Handle both Date objects and ISO strings from MongoDB
        const assignedDate = item.assigned_date instanceof Date 
          ? item.assigned_date 
          : new Date(item.assigned_date);
        
        // Check if date is valid
        if (isNaN(assignedDate.getTime())) return false;
        
        // Format both dates as YYYY-MM-DD for comparison
        const assignedDateStr = assignedDate.toISOString().split('T')[0];
        const todayStr = new Date().toISOString().split('T')[0];
        
        return assignedDateStr === todayStr;
      });
    
      return todaysAssignedPapers;
    };
    
    // Example usage
    
    
    // Example usage
   



  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/teacher/dashboard",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
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

   const weeklyData = getLast7DaysData(dashboardData);
    console.log(weeklyData);

    const todaysAssignedPapers = getTodaysAssignedPapers(dashboardData);
    

  return (
    <div className="bg-zinc-800 w-full h-screen text-white overflow-y-auto">
      <Navbar />
      <div className="dashboard-container p-8 pb-4 py-40">
        <Grid2 container spacing={2} columns={12}>
          {/* Quick Links Section */}
          <Grid2 size={2} >
          <Grid2 >
            <Link to="/teacher/assigned-papers">
              <Paper
                elevation={10}
                className="p-4"
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgb(50,50,50)",
                  alignItems: "center",
                }}
              >
                <h1 className="text-blue-500 uppercase w-full font-semibold">
                  Assigned Papers
                </h1>
              </Paper>
            </Link>
          </Grid2>
          <Grid2>
            <Link to="/teacher/pending-papers">
              <Paper
                elevation={10}
                className="p-4"
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgb(50,50,50)",
                  alignItems: "center",
                }}
              >
                <h1 className="text-blue-500 uppercase w-full font-semibold">
                  Pending papers
                </h1>
              </Paper>
            </Link>
          </Grid2>
          <Grid2>
            <Link to="/teacher/checked-papers">
              <Paper
                elevation={10}
                className="p-4"
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgb(50,50,50)",
                  alignItems: "center",
                }}
              >
                <h1 className="text-blue-500 uppercase w-full font-semibold">
                  Evaluated Papers
                </h1>
              </Paper>
            </Link>
          </Grid2>
          </Grid2>
          {/* StatCard Section */}

          <Grid2>
            <StatsCard data={dashboardData} />
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <AnswerPapersStatus data={answerPapersStatus} />
          </Grid2>
          <Grid2 size={8} >
                <WeeklyChart data={weeklyData} />
              </Grid2>

              {/* Today's Assigned Papers */}
              <Grid2 item xs={12}>
                <TodayAssignedPapers data={todaysAssignedPapers} />
              </Grid2>
        </Grid2>
      </div>
    </div>
  );
};

export default TeacherDashboard;
