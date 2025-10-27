import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function EduCard({ title, children, height = 260 }) {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: "4px",
        overflow: "hidden",
        bgcolor: "#fff",
        border: "1px solid #d0d3dc",
      }}
    >
      <Box
        sx={{
          bgcolor: "#4a4fa3",
          color: "#fff",
          px: 2,
          py: 1,
          borderBottom: "1px solid #2f326b",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            fontSize: "15px",
            color: "#fff",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ p: 2, height }}>
        {children}
      </Box>
    </Paper>
  );
}