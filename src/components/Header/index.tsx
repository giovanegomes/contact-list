import { AppBar, Box, TextField, Toolbar, Typography } from "@mui/material";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router";
import useStorage from "../../hooks/useStorage";
import StorageService from "../../services/StorageService";
import ConfirmDialog from "../ConfirmDialog";
import { useSelectedContactStore } from "../../hooks/useSelectedContactStore";
import { Button as MaterialButton } from "@mui/material";
import { useState } from "react";

type PropsType = {
  onChange: (password: string) => void;
  error?: string;
};

const ConfirmarSenha = ({ onChange, error }: PropsType) => {
  const [password, setPassword] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    onChange(value);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="body2">
        Para confirmar, digite sua senha abaixo:
      </Typography>
      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={handleChange}
        error={!!error}
        helperText={error}
        fullWidth
      />
    </Box>
  );
};

export default function Header() {
  const navigate = useNavigate();
  const [loggedUserId] = useStorage("loggedUserId");
  const [contacts] = useStorage("contacts");
  const [users] = useStorage("users");
  const { clearSelectedContact } = useSelectedContactStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const removeAccount = () => {
    const filteredContacts =
      contacts?.filter(({ userId }) => userId !== loggedUserId) || [];
    const filteredUsers = users?.filter(({ id }) => id !== loggedUserId) || [];

    StorageService.setItem("contacts", filteredContacts);
    StorageService.setItem("users", filteredUsers);
    StorageService.removeItem("loggedUserId");
    navigate("/login");
  };

  const logout = () => {
    StorageService.removeItem("loggedUserId");
    clearSelectedContact();
    navigate("/login");
  };

  const handleConfirm = () => {
    const user = users?.find(({ id }) => loggedUserId === id);
    if (password !== user.senha) {
      setError("Senha incorreta");
      return false;
    }

    removeAccount();
    return true;
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Lista de contatos
        </Typography>

        <ConfirmDialog
          title="Deseja mesmo excluir a sua conta?"
          content={
            <ConfirmarSenha
              onChange={(value) => {
                setPassword(value);
                setError("");
              }}
              error={error}
            />
          }
          onConfirm={handleConfirm}
          component={
            <MaterialButton variant="contained" color="error">
              Excluir minha conta
            </MaterialButton>
          }
        />
        <Button color="secondary" title="Sair" onClick={logout} />
      </Toolbar>
    </AppBar>
  );
}
