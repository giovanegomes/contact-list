import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../../components/UI/Input";
import { Button } from "../../components/UI/Button";
import { NavLink, useNavigate } from "react-router";
import StorageService from "../../services/StorageService";
import useStorage from "../../hooks/useStorage";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import styles from "./Login.module.css";
import { useState } from "react";
import { ErrorMessage } from "../../components/UI/ErrorMessage";
const loginSchema = z.object({
  email: z.string().trim(),
  senha: z.string().trim(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [users] = useStorage("users");
  const [loginError, setLoginError] = useState("");
  const { register, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const login = (data: LoginSchema) => {
    const { email, senha } = data;
    const user = users?.find((loginUser) => loginUser.email === email);
    setLoginError("");

    if (!user) {
      setLoginError("Usuário não encontrado.");
      return;
    }

    if (user.email !== email || user.senha !== senha) {
      setLoginError("Senha inválida.");
      return;
    }

    StorageService.setItem("loggedUserId", user.id);
    navigate("/home");
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card elevation={4}>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit(login)}
              sx={{
                display: "flex",
                fled: 1,
                flexDirection: "column",
                gap: 2,
                padding: 5,
              }}
            >
              <Input
                label="E-mail:"
                {...register("email")}
                type="email"
                required
              />
              <Input
                label="Senha:"
                {...register("senha")}
                type="password"
                required
              />
              <ErrorMessage isVisible={!!loginError} message={loginError} />
              <NavLink to="/register" end className={styles.link}>
                <Typography variant="subtitle2">
                  Não possui cadastro? Crie uma conta aqui.
                </Typography>
              </NavLink>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button type="submit" title="Entrar" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
