import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {Paper , Typography} from "@mui/material"

const WeeklyChart = ({ data }) => {
  return (
    <Paper elevation={10} className="p-4" style={{ backgroundColor: "rgb(50,50,50)" }}>
      <Typography variant="h6" className="text-blue-500 mb-4">
        Weekly Performance
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="assigned" stroke="#8884d8" name="Assigned Papers" />
          <Line type="monotone" dataKey="evaluated" stroke="#82ca9d" name="Evaluated Papers" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default WeeklyChart;