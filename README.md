# Plataforma de Datos para la Democracia

**Repositorio oficial del proyecto de visualización y análisis de datos sociales, económicos y públicos desarrollado por [Fundación Nodo XXI](https://nodoxxi.cl/).**

---

## 🚀 Descripción
La **Plataforma de Datos para la Democracia** centraliza información de distintas fuentes públicas de Chile, como el Banco Central, FONASA, ENE y ministerios sectoriales.  
El objetivo es ofrecer **visualizaciones interactivas, dashboards temáticos y acceso libre** a indicadores clave de economía, trabajo, salud y educación.

---

## 🧩 Tecnologías principales
- **Frontend:** React + Material UI (MUI)  
- **Backend:** Node.js + Express  
- **Gráficos:** Recharts / MUI X Charts  
- **Base de datos:** PostgreSQL  
- **Infraestructura:** AWS / Vercel / Render *(según despliegue)*

---

## 📁 Estructura del proyecto
plataforma-datos/
├── backend/ # API y conexión con fuentes externas
├── src/ # Componentes React (frontend)
├── public/ # Archivos estáticos
├── package.json # Dependencias frontend
└── README.md

yaml
Copiar código

---

## ⚙️ Instalación y uso
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Compilar para producción
npm run build
