import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CloseIcon from "@mui/icons-material/Close";

export default function Contactanos() {
  return (
    <Box sx={{ bgcolor: "#F5F6F8", minHeight: "100vh" }}>
      {/* Hero / Encabezado */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#0B3D91",
          color: "#FFFFFF",
          py: { xs: 4, md: 6 },
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            fontSize: { xs: "1.8rem", md: "2rem" },
          }}
        >
          Contáctanos
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mt: 1.5,
            maxWidth: 700,
            mx: "auto",
            color: "rgba(255,255,255,0.8)",
            fontSize: { xs: "0.95rem", md: "1rem" },
          }}
        >
          ¿Tienes dudas, necesitas datos específicos o quieres colaborar?
          Escríbenos y nuestro equipo te responderá a la brevedad.
        </Typography>
      </Box>

      {/* Contenido principal */}
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 4, md: 6 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow:
              "0px 12px 32px rgba(0,0,0,0.06), 0px 2px 6px rgba(0,0,0,0.04)",
            p: { xs: 3, md: 4 },
            bgcolor: "#FFFFFF",
            width: "100%",
            maxWidth: "700px", // <-- card centrada y elegante
            mx: "auto",
            textAlign: "center",
          }}
        >
          {/* Bloque título interno */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1E1E1E",
              fontSize: { xs: "1.05rem", md: "1.15rem" },
              mb: 2,
              textAlign: "center",
            }}
          >
            Envíanos un mensaje
          </Typography>

          {/* FORM */}
          <Stack
            spacing={2}
            sx={{
              width: "100%",
              maxWidth: "560px", // ancho máximo cómodo
              mx: "auto",
              textAlign: "left", // inputs alineados normal
            }}
          >
            <TextField
              fullWidth
              required
              label="Nombre"
              variant="outlined"
              size="medium"
              InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
              inputProps={{ "aria-label": "Nombre" }}
            />

            <TextField
              fullWidth
              required
              type="email"
              label="Correo electrónico"
              variant="outlined"
              size="medium"
              InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
              inputProps={{ "aria-label": "Correo electrónico" }}
            />

            <TextField
              fullWidth
              label="Asunto"
              variant="outlined"
              size="medium"
              InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
              inputProps={{ "aria-label": "Asunto" }}
            />

            <TextField
              fullWidth
              required
              label="Mensaje"
              placeholder="Cuéntanos cómo podemos ayudarte…"
              variant="outlined"
              multiline
              minRows={6}
              InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
              inputProps={{ "aria-label": "Mensaje" }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                disableElevation
                sx={{
                  bgcolor: "#A6110F",
                  "&:hover": { bgcolor: "#8F0E0D" },
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Enviar mensaje
              </Button>
            </Box>
          </Stack>

          {/* Separador visual */}
          <Divider sx={{ my: 4 }} />

          {/* CONTACTO / REDES */}
          <Stack
            spacing={2}
            sx={{
              width: "100%",
              maxWidth: "560px",
              mx: "auto",
              textAlign: { xs: "center", sm: "center" },
            }}
          >
            {/* Contacto directo */}
  

            {/* Redes */}
            <Box>
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: 0.6,
                  color: "#5A5D63",
                  mb: 1,
                }}
              >
                Síguenos
              </Typography>

              <Stack
                direction="row"
                spacing={1.5}
                justifyContent="center"
                flexWrap="wrap"
              >
                {/* Facebook */}
                <IconButton
                  aria-label="Facebook"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.15)",
                    bgcolor: "#FFFFFF",
                    boxShadow:
                      "0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)",
                    "&:hover": {
                      bgcolor: "#F5F6F8",
                    },
                  }}
                >
                  <FacebookIcon
                    sx={{
                      fontSize: 20,
                      color: "#0B3D91",
                    }}
                  />
                </IconButton>

                {/* X / Twitter placeholder */}
                <IconButton
                  aria-label="X / Twitter"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.15)",
                    bgcolor: "#FFFFFF",
                    boxShadow:
                      "0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)",
                    "&:hover": {
                      bgcolor: "#F5F6F8",
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      fontSize: 20,
                      color: "#0B3D91",
                    }}
                  />
                </IconButton>

                {/* Instagram */}
                <IconButton
                  aria-label="Instagram"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.15)",
                    bgcolor: "#FFFFFF",
                    boxShadow:
                      "0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)",
                    "&:hover": {
                      bgcolor: "#F5F6F8",
                    },
                  }}
                >
                  <InstagramIcon
                    sx={{
                      fontSize: 20,
                      color: "#0B3D91",
                    }}
                  />
                </IconButton>

                {/* LinkedIn */}
                <IconButton
                  aria-label="LinkedIn"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.15)",
                    bgcolor: "#FFFFFF",
                    boxShadow:
                      "0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)",
                    "&:hover": {
                      bgcolor: "#F5F6F8",
                    },
                  }}
                >
                  <LinkedInIcon
                    sx={{
                      fontSize: 20,
                      color: "#0B3D91",
                    }}
                  />
                </IconButton>
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Aviso privacidad */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  lineHeight: 1.4,
                  color: "#9EA1A7",
                }}
              >
                La información que nos compartes se utiliza solo para responder
                tu solicitud de contacto.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
