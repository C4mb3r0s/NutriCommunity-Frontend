# NutriCommunity Frontend

Aplicación web de NutriCommunity construida con React y TypeScript. Permite a los participantes consultar publicaciones, reaccionar, comentar y crear contenido. También incluye un dashboard para que los administradores gestionen usuarios.

El frontend se encuentra actualmente en la etapa MVP y se comunica con el backend mediante una API REST.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=20232A" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/CSS%20Modules-Styles-1572B6?logo=cssmodules&logoColor=white" alt="CSS Modules" />
  <img src="https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker Compose" />
  <img src="https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Jest-Testing-C21325?logo=jest&logoColor=white" alt="Jest" />
  <img src="https://img.shields.io/badge/Testing%20Library-React-E33332?logo=testinglibrary&logoColor=white" alt="Testing Library" />
  <img src="https://img.shields.io/badge/ESLint-Standard-4B32C3?logo=eslint&logoColor=white" alt="ESLint" />
</p>

## Navegación

- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Desarrollo local](#desarrollo-local)
- [Docker](#docker)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Funcionalidades](#funcionalidades)
- [Arquitectura](#arquitectura)
- [Comunicación con el backend](#comunicación-con-el-backend)
- [Estilos](#estilos)
- [Pruebas](#pruebas)
- [Comandos](#comandos)

## Tecnologías

### Dependencias de producción

- React 19.
- React DOM 19.
- React Router DOM 7.
- Zod 4 para validación de formularios.
- CSS Modules para estilos encapsulados.

### Dependencias de desarrollo

- Vite 8.
- TypeScript 6.
- ESLint con configuración Standard.
- Jest.
- React Testing Library.
- `@testing-library/jest-dom`.
- `@testing-library/user-event`.
- JSDOM para pruebas de componentes.
- Babel para transformar TypeScript y JSX en Jest.
- Docker Compose para el entorno de desarrollo.

## Requisitos

Se recomienda utilizar:

- Node.js 22 o superior.
- pnpm.
- Docker Engine y Docker Compose V2, si se utilizará Docker.
- Backend de NutriCommunity ejecutándose en `http://localhost:3000`.

Verifica las herramientas instaladas:

```bash
node --version
pnpm --version
docker --version
docker compose version
```

En Windows se pueden ejecutar los comandos desde WSL2, PowerShell o Git Bash. Si se utiliza Docker Engine dentro de WSL2, los comandos de Docker deben ejecutarse desde esa distribución.

## Instalación

Desde la raíz del repositorio:

```bash
cd nutriCommunity_frontend
pnpm install
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
pnpm install
```

## Variables de entorno

El archivo `.env.example` contiene la configuración mínima:

```env
# Backend URL used by the frontend during local development.
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` define la URL base utilizada por los servicios HTTP del frontend.

Consideraciones importantes:

- Las variables que Vite expone al navegador deben comenzar con `VITE_`.
- No se deben guardar secretos del backend en variables `VITE_*`; cualquier valor de este tipo queda incluido en el código del navegador.
- `.env` es local y no debe subirse al repositorio.
- `.env.example` sí debe mantenerse versionado.
- Después de cambiar `.env`, reinicia Vite para que cargue los nuevos valores.
- En el entorno local, el backend debe estar disponible en `http://localhost:3000`.

## Desarrollo local

Inicia el backend y luego ejecuta el frontend:

```bash
pnpm dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

Vite utiliza el puerto `4001` dentro de Docker. Cuando se ejecuta directamente con `pnpm dev`, Vite utiliza su puerto predeterminado `5173`.

## Docker

El proyecto cuenta con un contenedor de desarrollo que ejecuta Vite con HMR.

Para construir e iniciar el frontend:

```bash
pnpm run compile
```

Con Docker, la aplicación estará disponible en:

```text
http://localhost:4000
```

El mapeo de puertos es:

```text
localhost:4000:4001
```

El puerto `4001` es interno del contenedor y el puerto `4000` es el que utiliza el navegador.

El contenedor utiliza un volumen para mantener las dependencias instaladas dentro de Docker y un bind mount para reflejar los cambios del código local.

Comandos útiles:

```bash
docker compose ps
docker compose logs -f frontend
docker compose stop
docker compose down
docker compose up --build -d
```

`docker compose down` elimina los contenedores y la red del proyecto, pero no elimina el código fuente ni el volumen de dependencias salvo que se utilice explícitamente `docker compose down --volumes`.

## Rutas de la aplicación

| Ruta | Acceso | Pantalla |
|---|---|---|
| `/login` | Público | Inicio de sesión |
| `/` | Usuario autenticado | Publicaciones de la comunidad |
| `/admin` | Usuario con rol `admin` | Dashboard administrativo |
| Cualquier otra ruta | Redirección | `/` |

### Protección de rutas

- `ProtectedRoute` redirige a `/login` cuando no existe una sesión válida.
- `AdminRoute` restringe `/admin` a usuarios con el rol `admin`.
- `AppLayout` contiene el navbar compartido por las pantallas protegidas.
- Mientras se verifica la sesión se muestra un estado de carga.

## Funcionalidades

### Autenticación

- Login con correo y contraseña.
- Validación de datos con Zod.
- Modal para errores de credenciales, validación o servidor.
- Campo de contraseña con opción para mostrar u ocultar el valor.
- Access token almacenado únicamente en memoria.
- Refresh token administrado por el backend mediante cookie `httpOnly`.
- Token CSRF leído desde cookie y enviado mediante `X-CSRF-Token`.
- Renovación automática del access token después de una respuesta `401`.
- Evita múltiples renovaciones simultáneas usando una promesa compartida.
- Limpia la sesión y redirige al login si el refresh token expira o es inválido.

### Navbar y perfil

- Muestra el primer nombre y apellido del usuario.
- Despliega nombre completo, correo y roles.
- Muestra el acceso al dashboard cuando el usuario tiene rol `admin`.
- Permite cerrar sesión y regresar a `/login`.
- El logo de NutriCommunity redirige al inicio sin cerrar sesión.

### Publicaciones

- Listado paginado de publicaciones.
- Visualización del título, autor y tipo de contenido.
- Creación de publicaciones desde un modal.
- Selección del tipo de contenido obtenido desde el backend.
- Guardado como borrador o publicación directa.
- Eliminación por el autor o por un administrador.
- Actualización de la lista después de crear o eliminar una publicación.

### Reacciones

Se admiten tres tipos de reacción:

- `like` — Me gusta.
- `love` — Me encanta.
- `amaze` — Me asombra.

El botón seleccionado se conserva visualmente cuando el backend devuelve la reacción activa. Cambiar de reacción reemplaza la anterior y repetir la misma reacción la elimina.

### Comentarios

- Carga inicial de 10 comentarios.
- Botón para consultar la siguiente página.
- Conserva los comentarios cargados anteriormente.
- Muestra el nombre del autor resaltado y el contenido debajo.
- Maneja mensajes de error sin desmontar la publicación.

### Administración

- Listado paginado de usuarios.
- Registro de usuarios desde un modal.
- Activación de usuarios.
- Suspensión de usuarios.
- Eliminación lógica de usuarios.
- Protección visual y funcional de las cuentas con rol `admin`.

## Arquitectura

```text
nutriCommunity_frontend/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── comments/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── posts/
│   │   ├── profile/
│   │   └── reactions/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   └── home/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.json
└── vite.config.ts
```

Responsabilidades principales:

| Carpeta | Responsabilidad |
|---|---|
| `components` | Componentes reutilizables de la interfaz. |
| `pages` | Pantallas principales del sistema. |
| `layouts` | Estructuras compartidas entre páginas. |
| `routes` | Protección y control de navegación. |
| `context` | Estado global de autenticación. |
| `hooks` | Hooks personalizados. |
| `services` | Comunicación con el backend. |
| `schemas` | Validación de formularios con Zod. |
| `types` | Tipos y contratos de TypeScript. |
| `*.module.css` | Estilos encapsulados por componente o página. |

## Comunicación con el backend

Todas las solicitudes se centralizan en `src/services/api.ts`.

Características principales:

- Utiliza `fetch`.
- Envía `credentials: 'include'` para conservar las cookies.
- Usa `VITE_API_URL` como URL base.
- Agrega automáticamente `Authorization: Bearer <accessToken>` cuando existe un token.
- Convierte errores HTTP en instancias de `ApiError`.
- Intenta renovar la sesión cuando recibe `401`.
- Repite la solicitud original después de una renovación exitosa.

Servicios disponibles:

| Servicio | Responsabilidad |
|---|---|
| `auth.service.ts` | Login, refresh, logout, usuario actual y registro administrativo. |
| `auth-session.ts` | Manejo en memoria del access token y renovación única. |
| `admin.service.ts` | Consulta y actualización de usuarios. |
| `post.service.ts` | Publicaciones, tipos de contenido y reacciones. |
| `comment.service.ts` | Consulta de comentarios. |
| `api.ts` | Cliente HTTP y manejo común de respuestas. |

## Estilos

El frontend utiliza CSS Modules y una paleta global definida en `src/index.css`:

```css
--color-navy: #112E40;
--color-blue-gray: #C8D3D9;
--color-blue: #025273;
--color-cyan: #41D1F3;
--color-light-cyan: #3DE0F3;
```

No se utiliza Tailwind CSS ni una biblioteca externa de componentes. Los estilos de páginas y componentes se encuentran junto a sus archivos mediante nombres como `ComponentName.module.css`.

Los estados `:hover`, `:focus-visible` y `:disabled` deben conservarse para mantener una interacción clara y accesible.

## Pruebas

El proyecto ya incluye dependencias para preparar pruebas con Jest y React Testing Library:

- Jest.
- `@testing-library/react`.
- `@testing-library/jest-dom`.
- `@testing-library/user-event`.
- `jest-environment-jsdom`.
- Babel para TypeScript y JSX.

Actualmente no existe un script `test` configurado en `package.json` ni archivos de pruebas registrados en el proyecto. Por ese motivo, `pnpm test` todavía no es un comando disponible.

Cuando se implemente la configuración de pruebas, se recomienda cubrir:

- Login válido e inválido.
- Validación de contraseñas y formularios.
- Renovación del access token.
- Logout y limpieza de sesión.
- Redirección de rutas protegidas.
- Acceso administrativo por rol.
- Creación y eliminación de publicaciones.
- Reacciones activas y eliminadas.
- Paginación de comentarios.
- Registro y actualización de usuarios desde el dashboard.

## Comandos

Los comandos se ejecutan desde `nutriCommunity_frontend` después de instalar las dependencias.

| Comando | Descripción |
|---|---|
| `pnpm install` | Instala las dependencias del proyecto. |
| `pnpm dev` | Inicia Vite en modo desarrollo con HMR. |
| `pnpm build` | Ejecuta la compilación de TypeScript y genera `dist/`. |
| `pnpm preview` | Sirve localmente la compilación generada. |
| `pnpm lint` | Ejecuta ESLint. |
| `pnpm run compile` | Construye e inicia el contenedor Docker del frontend. |

## Git e información local

El `.gitignore` excluye dependencias, compilaciones, cachés, reportes de pruebas, archivos de entorno y configuraciones locales de editores.

Únicamente `.env.example` debe versionarse. El archivo `.env` puede contener configuraciones locales y debe permanecer fuera del repositorio.
