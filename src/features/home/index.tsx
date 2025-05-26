import { useNavigate } from "react-router";
import { ContactList } from "./components/List";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { Button } from "../../components/UI/Button";
import Map from "./components/Map";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 2, height: "100vh" }}>
        <Button
          title="Novo contato"
          sx={{ mb: 2 }}
          onClick={() => navigate("/contact")}
        />
        <Box sx={{ height: "90%", bgcolor: "background.default" }}>
          <Grid
            container
            spacing={2}
            sx={{
              height: "calc(100% - 80px)",
            }}
          >
            <Grid size={{ xs: 12, sm: 3 }}>
              <Paper sx={{ height: "100%", p: 2 }}>
                <Typography variant="h6" mb={1} textAlign="center">
                  Contatos
                </Typography>
                <ContactList />
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 9 }}>
              <Paper sx={{ height: "100%", p: 2 }}>
                <Typography variant="h6" mb={1} textAlign="center">
                  Mapa
                </Typography>
                <Map />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
