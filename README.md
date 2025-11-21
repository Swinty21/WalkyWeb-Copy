# WalkyApp WEB

**Descripción**: 
- **Proyecto:** Interfaz web (frontend) de WalkyApp. Está implementada con React y Vite como bundler/servidor de desarrollo. Provee páginas y componentes para roles como administrador, cliente, walker y soporte; autenticación, manejo de usuarios, walk-tracking, chat y visualización de datos.

**Tecnologías & Lenguajes**:
- **Lenguaje:** JavaScript (ES Modules, React JSX).
- **Framework / Tooling:** `React`, `Vite`.
- **Estilos:** `Tailwind CSS`.
- **Mapas:** `@react-google-maps/api` (Google Maps).
- **Gráficas:** `chart.js`, `react-chartjs-2`, `recharts`.
- **Utilidades:** `date-fns`, `react-icons`.

**Dependencias principales** 
- `react`, `react-dom`
- `vite`, `@vitejs/plugin-react`
- `tailwindcss`, `@tailwindcss/vite`
- `@react-google-maps/api`
- `chart.js`, `react-chartjs-2`, `recharts`
- `date-fns`, `react-icons`

**Scripts útiles**
- `npm run dev` — Ejecuta el servidor de desarrollo (Vite).
- `npm run build` — Genera build de producción.
- `npm run preview` — Sirve la versión build localmente para pruebas.
- `npm run lint` — Ejecuta ESLint sobre el proyecto.

**Variables de entorno**
- `VITE_API_BASE_URL` — URL base para la API (ej: `http://localhost:3000/api`).
- `VITE_GOOGLE_API_KEY` / `GOOGLE_MAPS_API_KEY` — clave de Google Maps.
- `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, `VITE_CLOUDINARY_API_KEY`, `VITE_CLOUDINARY_API_KEY_SECRET` — configuración de Cloudinary.

**Estructura y arquitectura (resumen basado en `src/`)**:
- `src/main.jsx` — punto de entrada; monta la app React.
- `src/App.jsx` — componente raíz que maneja autenticación, layout y providers.
- `src/index.css` — estilos globales (Tailwind).
- `src/BackEnd/ApiClient.js` — cliente HTTP central (ahora lee `import.meta.env.VITE_API_BASE_URL`).
- `src/BackEnd/Controllers/` — controladores que exponen funciones para llamadas a la API (ej. `AuthController.js`, `UserController.js`).
- `src/BackEnd/Services/` — lógica de negocio cliente (servicios que llaman `ApiClient`/controladores).
- `src/BackEnd/DataAccess/` — adaptadores de acceso a datos (peticiones a endpoints concretos).
- `src/BackEnd/Context/` — Providers y contextos React (usuario, navegación, toast, historial).
- `src/Pages/` — vistas organizadas por áreas: `Auth`, `Admin`, `User`, `Common`, `General`.
- `public/Images/` — recursos estáticos (icons, backgrounds, profile, etc.).

Esta organización sigue un patrón donde los controllers/ services / data access agrupan responsabilidades relacionadas con la API y la lógica de cliente, mientras que `Pages/` contiene UI y componentes por dominio.

**Configuración local y puesta en marcha**
1. Clona el repositorio:

```powershell
git clone <repo-url>
cd WalkyApp-Web
```

2. Instala dependencias:

```powershell
npm install
```

3. Crea un archivo `.env` en la raíz con al menos estas variables (ejemplo mínimo):

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_API_KEY=tu_google_maps_api_key
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
VITE_CLOUDINARY_API_KEY=tu_cloudinary_key
VITE_CLOUDINARY_API_KEY_SECRET=tu_cloudinary_secret
```

4. Ejecuta el servidor de desarrollo:

```powershell
npm run dev
```

5. Abre `http://localhost:5173` (o la URL que Vite muestre en consola).

6. Para build de producción y preview:

```powershell
npm run build
npm run preview
```

**Notas sobre la API**:
- La comunicación con la API se centraliza en `src/BackEnd/ApiClient.js`. Este archivo usa `import.meta.env.VITE_API_BASE_URL` (si está definida) y un fallback a `http://localhost:3000/api`.
- Asegúrate de que el backend esté corriendo y accesible en la URL indicada por `VITE_API_BASE_URL`.

**Qué verificar si algo falla**:
- Variables de entorno presentes y con valores correctos.
- Backend activo en `VITE_API_BASE_URL`.
- Ejecutar `npm install` para tener todas las dependencias.
- Revisar la consola del navegador y la terminal de Vite para errores.