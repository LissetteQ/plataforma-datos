// src/pages/Contactanos.jsx
import React, { useState } from "react";
import {
  Box, Container, Typography, TextField, Button, IconButton,
  Paper, Divider, Stack, Alert, CircularProgress,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CloseIcon from "@mui/icons-material/Close";
import emailjs from "@emailjs/browser";

const iconBtnSx = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(0,0,0,0.15)",
  bgcolor: "#FFFFFF",
  boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)",
  "&:hover": { bgcolor: "#F5F6F8" },
};

export default function Contactanos() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({ email: "" });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  const validateEmail = (email) => {
    // Regex simple: debe tener texto antes y después de @
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    if (name === "email") {
      if (!value.includes("@")) {
        setErrors((prev) => ({ ...prev, email: "El correo debe contener @" }));
      } else if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Formato de correo no válido (ej: nombre@dominio.com)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", msg: "" });

    if (!form.name || !form.email || !form.message) {
      setFeedback({ type: "error", msg: "Completa nombre, correo y mensaje." });
      return;
    }
    if (!validateEmail(form.email)) {
      setFeedback({ type: "error", msg: "Por favor ingresa un correo válido con @." });
      return;
    }

    const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("Faltan variables de entorno REACT_APP_...");
      setFeedback({
        type: "error",
        msg: "Faltan variables de entorno. Revisa .env y reinicia el servidor.",
      });
      return;
    }

    setSending(true);
    try {
      const templateParams = {
        from_name: form.name,
        from_email: form.email,
        subject: form.subject || `Nuevo mensaje de ${form.name}`,
        message: form.message,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });

      setFeedback({ type: "success", msg: "¡Gracias! Tu mensaje fue enviado correctamente." });
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({ email: "" });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", msg: "Ocurrió un problema al enviar. Intenta nuevamente." });
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#F5F6F8", minHeight: "100vh" }}>
      {/* Hero */}
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
          sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: "1.8rem", md: "2rem" } }}
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
          ¿Tienes dudas, necesitas datos específicos o quieres colaborar? Escríbenos y nuestro equipo
          te responderá a la brevedad.
        </Typography>
      </Box>

      {/* Card */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0px 12px 32px rgba(0,0,0,0.06), 0px 2px 6px rgba(0,0,0,0.04)",
            p: { xs: 3, md: 4 },
            bgcolor: "#FFFFFF",
            width: "100%",
            maxWidth: "700px",
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1E1E1E",
              fontSize: { xs: "1.05rem", md: "1.15rem" },
              mb: 1.5,
            }}
          >
            Envíanos un mensaje
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {feedback.msg && (
            <Alert
              severity={feedback.type === "success" ? "success" : "error"}
              sx={{ mb: 2, textAlign: "left" }}
              onClose={() => setFeedback({ type: "", msg: "" })}
              action={
                <IconButton
                  size="small"
                  aria-label="cerrar"
                  onClick={() => setFeedback({ type: "", msg: "" })}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              {feedback.msg}
            </Alert>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%", maxWidth: "560px", mx: "auto", textAlign: "left" }}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                label="Nombre"
                name="name"
                value={form.name}
                onChange={onChange}
                variant="outlined"
                size="medium"
                InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
              />

              {/* Campo de correo con validación */}
              <TextField
                fullWidth
                required
                type="email"
                label="Correo electrónico"
                name="email"
                value={form.email}
                onChange={onChange}
                variant="outlined"
                size="medium"
                error={Boolean(errors.email)}
                helperText={errors.email}
                InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
              />

              <TextField
                fullWidth
                label="Asunto"
                name="subject"
                value={form.subject}
                onChange={onChange}
                variant="outlined"
                size="medium"
                InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
              />

              <TextField
                fullWidth
                required
                label="Mensaje"
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Cuéntanos cómo podemos ayudarte…"
                variant="outlined"
                multiline
                minRows={6}
                InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
              />

              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={sending}
                  startIcon={sending ? <CircularProgress size={18} /> : null}
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
                  {sending ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Síguenos (usa los 3 íconos importados) */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
              Síguenos
            </Typography>
            <Stack direction="row" spacing={1.5} justifyContent="center">
              <IconButton sx={iconBtnSx} aria-label="Facebook" component="a" href="#" target="_blank" rel="noopener">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton sx={iconBtnSx} aria-label="Instagram" component="a" href="#" target="_blank" rel="noopener">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton sx={iconBtnSx} aria-label="LinkedIn" component="a" href="#" target="_blank" rel="noopener">
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
