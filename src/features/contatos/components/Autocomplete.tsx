import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
} from "@mui/material";
import type { Endereco } from "../../../@types/Address";

export default function AddressAutocomplete({
  suggestions,
  anchorElement,
  onSelect,
}: PropsType) {
  return (
    <Popper
      open={suggestions?.length > 0}
      anchorEl={anchorElement}
      placement="bottom-start"
      style={{ zIndex: 1300 }}
    >
      <Paper
        sx={{
          width: anchorElement?.clientWidth || 300,
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        <List>
          {suggestions.map((endereco) => (
            <ListItem
              key={endereco.cep}
              component="button"
              onClick={() => onSelect(endereco)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#b4babb" },
              }}
            >
              <ListItemText
                primary={`${endereco.logradouro}, ${endereco.bairro}, ${endereco.cep} `}
              />
              <Divider />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Popper>
  );
}

type PropsType = {
  suggestions: Endereco[];
  anchorElement: HTMLElement | null;
  onSelect: (endereco: Endereco) => void;
};
