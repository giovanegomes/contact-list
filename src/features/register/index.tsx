import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../../components/UI/Input";
import { Button } from "../../components/UI/Button";
import StorageService from "../../services/StorageService";
import { useNavigate } from "react-router";
import useStorage from "../../hooks/useStorage";
import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";

const registerSchema = z.object({
  id: z.string(),
  email: z
    .string()
    .nonempty("Por favor, informe seu email.")
    .email("Email inválido.")
    .trim(),
  senha: z
    .string()
    .min(3, "A senha deve conter pelo menos 3 caracteres.")
    .trim(),
});

export type User = z.infer<typeof registerSchema>;

const createSchema = (users: User[]) =>
  registerSchema.superRefine(({ email }, context) => {
    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "E-mail informado já está cadastrado.",
        path: ["email"],
      });
    }
  });

export default function Register() {
  const navigate = useNavigate();
  const [users] = useStorage("users");
  const schema = createSchema(users || []);
  const userId = crypto.randomUUID();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue("id", userId);
  }, [userId, setValue]);

  const createUser = (data: User) => {
    const users = StorageService.getItem("users") || [];

    StorageService.setItem("users", [...users, data]);

    navigate("/login");
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
        <Box
          component="form"
          onSubmit={handleSubmit(createUser)}
          sx={{
            display: "flex",
            fled: 1,
            flexDirection: "column",
            gap: 2,
            padding: 5,
            width: "60%",
          }}
        >
          <Typography variant="h4" color="primary">
            Faça seu cadastro:
          </Typography>

          <Input
            label="E-mail:"
            {...register("email")}
            type="email"
            showError={!!errors.email?.message}
            errorMessage={errors.email?.message}
          />
          <Input
            label="Senha:"
            {...register("senha")}
            type="password"
            showError={!!errors.senha?.message}
            errorMessage={errors.senha?.message}
          />
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              type="button"
              title="Voltar"
              color="secondary"
              onClick={() => navigate(-1)}
            />
            <Button type="submit" title="Cadastrar" />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
