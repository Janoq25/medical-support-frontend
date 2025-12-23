# AI Medical Support Frontend

Este proyecto es el frontend para la plataforma de **AI Medical Support**, una aplicación diseñada para asistir a profesionales de la salud mediante la gestión de pacientes, seguimiento de indicadores de salud y consultas asistidas por Inteligencia Artificial.

## 🚀 Tecnologías

El proyecto está construido utilizando las siguientes tecnologías principales:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Librería UI:** [React 19](https://react.dev/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Lenguaje:** JavaScript

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio:**

```bash
git clone <url-del-repositorio>
cd medical-support-frontend
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**

Crea un archivo `.env.local` en la raíz del proyecto (si no existe) y configura la URL del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. **Ejecutar el servidor de desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 📂 Estructura del Proyecto

La estructura principal del código fuente se encuentra en la carpeta `src/`:

- **`app/`**: Contiene las rutas y páginas de la aplicación (Next.js App Router).
  - `(auth)/`: Rutas públicas de autenticación (Login, Registro).
  - `dashboard/`: Rutas protegidas del panel principal.
- **`components/`**: Componentes de React.
  - `features/`: Componentes específicos de funcionalidades (Auth, Charts, Indicators, Patients).
  - `layout/`: Componentes de estructura (Sidebar, AuthLayout).
  - `ui/`: Componentes base reutilizables (Button, Card, Input, etc.).
- **`context/`**: Contextos de React para manejo de estado global (Auth, Theme, Toast).
- **`services/`**: Lógica de comunicación con la API y utilidades.
- **`middleware.js`**: Middleware para protección de rutas y redirecciones.

## 🗺️ Vistas y Rutas

### Autenticación (Públicas)
- `/login`: Página de inicio de sesión.
- `/register`: Página de registro de nuevos usuarios.
- `/auth/google/success`: Página de redirección tras autenticación exitosa con Google.

### Dashboard (Protegidas)
Todas las rutas bajo `/dashboard` requieren autenticación.

#### General
- `/dashboard/home`: Vista principal del dashboard.

#### Gestión de Pacientes
- `/dashboard/pacientes`: Listado de todos los pacientes.
- `/dashboard/pacientes/nuevo`: Formulario para registrar un nuevo paciente.
- `/dashboard/pacientes/[id]/editar`: Formulario para editar datos de un paciente.
- `/dashboard/pacientes/[id]/historial`: Vista detallada del historial médico de un paciente.

#### Consultas AI
- `/dashboard/consulta/[patientId]`: Interfaz de chat y consulta asistida por IA para un paciente específico.

#### Indicadores
- `/dashboard/indicadores`: Tablero de indicadores de salud.
- `/dashboard/indicadores/nuevo`: Creación de nuevos indicadores.
- `/dashboard/indicadores/[id]/editar`: Edición de indicadores existentes.

## 🎨 Estilos y Tema

El proyecto utiliza una paleta de colores personalizada definida en `globals.css` usando variables CSS de Tailwind 4.
- **Primary:** Sage Green (`--color-sage-*`)
- **Secondary:** Warm Terracotta (`--color-terracotta-*`)

## 🔒 Autenticación y Seguridad

- La autenticación se maneja a través de `AuthContext`.
- Se soportan estrategias de Login Local y Google OAuth.
- El `middleware.js` verifica la presencia de cookies (`accessToken` o `jwt`) para permitir el acceso a las rutas de `/dashboard`.

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run lint`: Ejecuta el linter para verificar el código.

