import React, { useState } from "react";
import {
  Box, Container, Typography, TextField, Button,
  Paper, Stack, Alert, CircularProgress,
} from "@mui/material";
import emailjs from "@emailjs/browser";

export default function Contactanos() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({ email: "" });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  const validateEmail = (email) => {
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
    const PUBLIC_KEY  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

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

  // IDs para asociaciones accesibles
  const titleId = "contact-title";
  const descId = "contact-desc";
  const emailHelpId = "email-help";
  const messageHelpId = "message-help";

  return (
    <Box sx={{ bgcolor: "#F5F6F8", minHeight: "100vh" }}>
      {/* Hero */}
      <Box
        component="header"
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
          id={titleId}
          variant="h4"
          sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: "1.8rem", md: "2rem" } }}
        >
          Contáctanos
        </Typography>
        <Typography
          id={descId}
          variant="body1"
          sx={{
            mt: 1.5,
            maxWidth: 700,
            mx: "auto",
            color: "rgba(255,255,255,0.8)",
            fontSize: { xs: "0.95rem", md: "1rem" },
          }}
        >
          ¿Tienes dudas, necesitas datos específicos o quieres colaborar? Escríbenos y nuestro equipo te responderá a la brevedad.
        </Typography>
      </Box>

      {/* Card */}
      <Container
        component="section"
        aria-labelledby={titleId}
        maxWidth="lg"
        sx={{ py: { xs: 4, md: 6 }, display: "flex", justifyContent: "center" }}
      >
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
            component="h2"
            variant="h6"
            sx={{ fontWeight: 600, color: "#1E1E1E", fontSize: { xs: "1.05rem", md: "1.15rem" }, mb: 2 }}
          >
            Envíanos un mensaje
          </Typography>

          {/* Región en vivo para feedback accesible */}
          {feedback.msg && (
            <Alert
              role={feedback.type === "success" ? "status" : "alert"}
              severity={feedback.type === "success" ? "success" : "error"}
              sx={{ mb: 2, textAlign: "left" }}
              onClose={() => setFeedback({ type: "", msg: "" })}
            >
              {feedback.msg}
            </Alert>
          )}

          <Box
            component="form"
            role="form"
            aria-labelledby={titleId}
            aria-describedby={descId}
            aria-busy={sending ? "true" : "false"}
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%", maxWidth: "560px", mx: "auto", textAlign: "left" }}
          >
            <Stack spacing={2}>
              <TextField
                id="name"
                fullWidth
                required
                autoComplete="name"
                label="Nombre"
                name="name"
                value={form.name}
                onChange={onChange}
                variant="outlined"
                size="medium"
                InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                inputProps={{ "aria-required": "true" }}
              />

              {/* Campo de correo con validación */}
              <TextField
                id="email"
                fullWidth
                required
                type="email"
                autoComplete="email"
                label="Correo electrónico"
                name="email"
                value={form.email}
                onChange={onChange}
                variant="outlined"
                size="medium"
                error={Boolean(errors.email)}
                helperText={errors.email}
                InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                inputProps={{
                  "aria-required": "true",
                  "aria-invalid": Boolean(errors.email) ? "true" : "false",
                  "aria-describedby": errors.email ? emailHelpId : undefined,
                }}
                FormHelperTextProps={{ id: emailHelpId }}
              />

              <TextField
                id="subject"
                fullWidth
                autoComplete="on"
                label="Asunto"
                name="subject"
                value={form.subject}
                onChange={onChange}
                variant="outlined"
                size="medium"
                InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
              />

              <TextField
                id="message"
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
                autoComplete="off"
                InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                inputProps={{
                  "aria-required": "true",
                  "aria-describedby": messageHelpId,
                }}
              />

              {/* Texto de ayuda solo para lectores de pantalla */}
              <Typography
                id={messageHelpId}
                component="p"
                sx={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                  clip: "rect(1px, 1px, 1px, 1px)",
                  whiteSpace: "nowrap",
                }}
              >
                Describe tu consulta con el mayor detalle posible para agilizar la respuesta.
              </Typography>

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
                  aria-label="Enviar mensaje"
                  aria-disabled={sending ? "true" : "false"}
                >
                  {sending ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

// (opcional) estilos para iconos sociales si los usas
const iconBtnSx = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(0,0,0,0.15)",
  bgcolor: "#FFFFFF",
  boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)",
  "&:hover": { bgcolor: "#F5F6F8" },
};
