import { applyMask, type MaskType } from "../../utils/mask";
import { ErrorMessage } from "./ErrorMessage";
import { Box, TextField, type TextFieldProps } from "@mui/material";

export function Input(props: PropsType) {
  const { onChange: onChangeCallback, maskType, shoulShrink } = props;
  const slopProps = shoulShrink
    ? {
        inputLabel: {
          shrink: true,
        },
      }
    : undefined;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChangeCallback) return;

    if (maskType) {
      event.target.value = applyMask({ maskType, value: event.target.value });
    }

    onChangeCallback(event);
  };

  return (
    <Box>
      <TextField
        variant="outlined"
        fullWidth
        {...props}
        onChange={onChange}
        slotProps={slopProps}
      />
      <ErrorMessage isVisible={props.showError} message={props.errorMessage} />
    </Box>
  );
}

type PropsType = TextFieldProps & {
  label: string;
  showError?: boolean;
  errorMessage?: string;
  maskType?: MaskType;
  shoulShrink?: boolean;
};
