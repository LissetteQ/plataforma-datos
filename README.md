# 🚀 Guía de Deploy – Plataforma de Datos para la Democracia

**Repositorio oficial:** [https://github.com/datosnodoxxi/plataforma-datos](https://github.com/datosnodoxxi/plataforma-datos)

---

## 📦 Estructura general

- **Frontend (React)** → Aplicación web compilada e integrada como plugin de WordPress.  
- **Backend (Node.js + Express)** → API REST alojada en el mismo servidor que WordPress (expuesta bajo `/api`).

Ruta final de publicación:  
➡️ **https://www.nodoxxi.cl/datosparalademocracia/**

---

## 🧩 Requerimientos técnicos

- **Node.js:** v20.x  
- **npm:** v10.x  
- **Servidor web:** Nginx (reverse proxy hacia backend Node)  
- **WordPress:** v6.8 o superior (entorno de producción de Nodo XXI)

---

## ⚙️ Variables de entorno (`.env`)

Ejemplo de `.env.example`:

```env
PORT=5000
USER_BC=correo@ejemplo.cl
PASS_BC=*********
SERIE_ID=F022.TPM.TIN.D001.NO.Z.D
FIRST_DATE=2024-01-01
LAST_DATE=2025-10-01
(No subir .env real al repo.)

🧠 Backend – Despliegue
Instalar dependencias:

bash
Copiar código
cd backend
npm ci
Levantar con PM2:

bash
Copiar código
pm2 start index.js --name datos-api
pm2 save
Configurar CORS (permitir dominio de WordPress):

js
Copiar código
const cors = require('cors');
app.use(cors({ origin: ['https://www.nodoxxi.cl'] }));
Exponer /api con Nginx:

nginx
Copiar código
location /api/ {
  proxy_pass http://127.0.0.1:5000/;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
Healthcheck:

bash
Copiar código
curl https://www.nodoxxi.cl/api/health
➜ debe devolver { "status": "ok" }

🖥️ Frontend – Compilación
Compilar con la URL del backend final:

bash
Copiar código
REACT_APP_API_BASE_URL=https://www.nodoxxi.cl/api npm run build
Esto genera la carpeta /build que se incrusta dentro de WordPress como plugin.

🔌 Plugin de WordPress
Estructura del plugin (plataforma-datos-wp):

bash
Copiar código
plataforma-datos-wp/
├── plataforma-datos.php
└── build/             # carpeta generada por npm run build
Archivo plataforma-datos.php:

php
Copiar código
<?php
/**
 * Plugin Name: Plataforma de Datos para la Democracia
 * Description: Inserta la aplicación React dentro de WordPress como shortcode.
 * Version: 1.0.0
 */

function pdpd_enqueue_assets() {
  $manifest = plugin_dir_path(__FILE__) . 'build/asset-manifest.json';
  $base     = plugin_dir_url(__FILE__) . 'build/';
  if (!file_exists($manifest)) {
    wp_enqueue_style('pdpd-main-css', $base.'static/css/main.css', [], null);
    wp_enqueue_script('pdpd-main-js', $base.'static/js/main.js', [], null, true);
    return;
  }
  $data = json_decode(file_get_contents($manifest), true);
  $entries = $data['entrypoints'] ?? [];
  foreach ($entries as $file) {
    $url = $base . ltrim($file, '/');
    $h = 'pdpd-'.md5($file);
    if (substr($file,-4)==='.css') wp_enqueue_style($h,$url,[],null);
    if (substr($file,-3)==='.js')  wp_enqueue_script($h,$url,[],null,true);
  }
}
add_action('wp_enqueue_scripts','pdpd_enqueue_assets');

function pdpd_render_app(){ return '<div id="root"></div>'; }
add_shortcode('plataforma_datos','pdpd_render_app');
🧱 Instalación en WordPress
Comprimir la carpeta plataforma-datos-wp en .zip

En WP Admin → Plugins → Añadir nuevo → Subir plugin → subir el ZIP → Activar

Crear una página con slug datosparalademocracia

Insertar el shortcode:

csharp
Copiar código
[plataforma_datos]
Publicar la página
➜ Resultado: https://www.nodoxxi.cl/datosparalademocracia/

🧩 Configuración del Router en React
Se recomienda usar HashRouter:

jsx
Copiar código
import { HashRouter } from "react-router-dom";
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
Evita errores 404 dentro de WordPress.

✅ Checklist de validación final
Componente	Verificación	Resultado esperado
API /api/health	responde 200	{"status":"ok"}
Página /datosparalademocracia	carga sin errores CORS/404	✅
Gráficos macroeconómicos	muestran datos reales	✅
SSL	activo en WordPress y backend	🔒 HTTPS
Cache/CDN	vaciada tras deploy	🧹 Limpia

📨 Entrega a producción
Enviar al encargado:

✅ Link del repo: https://github.com/datosnodoxxi/plataforma-datos

✅ Archivo .env.example

✅ ZIP plataforma-datos-wp.zip

✅ Este documento (README-DEPLOY.md)


