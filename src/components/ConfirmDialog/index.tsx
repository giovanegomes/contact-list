import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function ConfirmDialog({
  title,
  content,
  component,
  onConfirm,
}: PropsType) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    const result = onConfirm();
    if (result) {
      setOpen(false);
    }
  };

  return (
    <>
      {isValidElement(component) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cloneElement(component as ReactElement<any>, { onClick: handleOpen })}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

type PropsType = {
  title: string;
  content: ReactNode;
  component: ReactElement;
  onConfirm: () => boolean;
};
