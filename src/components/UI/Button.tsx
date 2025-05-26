import { Button as MaterialButton, type ButtonProps } from "@mui/material";

export function Button(props: ButtonProps & { title: string }) {
  return (
    <MaterialButton variant="contained" color="primary" {...props}>
      {props.title}
    </MaterialButton>
  );
}
