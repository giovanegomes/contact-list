import { Typography } from "@mui/material";

export function ErrorMessage({ isVisible = false, message }: PropsType) {
  if (!isVisible) return;

  return (
    <Typography variant="subtitle2" color="error">
      {message}
    </Typography>
  );
}

type PropsType = {
  isVisible?: boolean;
  message?: string;
};
