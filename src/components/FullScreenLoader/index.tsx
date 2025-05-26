import { Box, CircularProgress } from "@mui/material";

export default function FullScreenLoader() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(255, 255, 255, 0.7)",
        zIndex: 1300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
