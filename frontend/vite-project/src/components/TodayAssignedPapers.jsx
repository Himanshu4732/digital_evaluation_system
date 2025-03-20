import React from "react";
import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";

const TodaysAssignedPapers = ({ data }) => {
  return (
    <Paper elevation={10} className="p-4" style={{ backgroundColor: "rgb(50,50,50)" }}>
      <Typography variant="h6" className="text-blue-500 mb-4">
        Today's Assigned Papers
      </Typography>
      {data.length > 0 ? (
        <List>
          {data.map((paper, index) => (
            <ListItem key={index} className="hover:bg-zinc-700">
              <ListItemText
                primary={paper.studentName}
                secondary={`Subject: ${paper.subject}, Assigned Date: ${paper.assigned_date}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" className="text-white">
          No papers assigned today.
        </Typography>
      )}
    </Paper>
  );
};

export default TodaysAssignedPapers;