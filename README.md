# BIBLIOTECH

[![CI](https://github.com/coxclode/BIBLIOTECH/actions/workflows/ci.yml/badge.svg)](https://github.com/coxclode/BIBLIOTECH/actions/workflows/ci.yml)

Sistema de Préstamo y Registro de Biblioteca. Aplicación web de tres capas (frontend, backend y base de datos) para gestionar libros, lectores y préstamos, con autenticación por roles, pruebas automatizadas, contenerización con Docker y un pipeline de integración continua con GitHub Actions.

## Descripción

BIBLIOTECH permite a una biblioteca:

- Autenticar a su personal (Administrador / Bibliotecario) mediante JWT.
- Gestionar el catálogo de libros (código, título, autor, categoría, ISBN, cantidad total y disponible).
- Gestionar el registro de lectores (DNI, nombre, apellidos, correo, teléfono).
- Registrar préstamos, validando disponibilidad y actualizando el stock automáticamente.
- Registrar devoluciones, restaurando la disponibilidad del libro.
- Consultar el historial completo de préstamos (libro, lector, fechas y estado).

## Planificación

Los requisitos funcionales, roles de usuario y el modelo de datos están
documentados en [`PLANNING.md`](PLANNING.md).

El seguimiento del trabajo se hace con **GitHub Projects** (tablero Kanban) e
**Issues**:

- Tablero: [BIBLIOTECH Roadmap](https://github.com/users/coxclode/projects/1),
  con columnas `Todo` → `In Progress` → `Done`.
- Cada funcionalidad principal tiene su Issue en
  [coxclode/BIBLIOTECH/issues](https://github.com/coxclode/BIBLIOTECH/issues),
  etiquetado como `feature`, `bug` o `docs` según corresponda.
- Al mover un Issue a `Done` en el tablero, GitHub lo cierra automáticamente
  (workflow por defecto del tablero).
- Los commits y Pull Requests que resuelven un Issue lo referencian en el
  mensaje (por ejemplo `Closes #4`); GitHub cierra el Issue automáticamente al
  fusionar el commit/PR a `main`.

## Arquitectura

Arquitectura de tres capas, cada una en su propio contenedor Docker:

```
┌─────────────┐      HTTP/JSON      ┌─────────────┐      SQL      ┌──────────────┐
│  Frontend   │  ─────────────────► │   Backend   │ ─────────────►│  PostgreSQL  │
│ React + Vite│ ◄───────────────── │ Express API │ ◄───────────── │              │
│  (nginx)    │                     │  + Prisma   │                │              │
└─────────────┘                     └─────────────┘                └──────────────┘
```

El backend sigue una arquitectura por capas (`routes` → `controllers` → `services` → `Prisma`), con middlewares centralizados para autenticación, autorización por rol y manejo de errores.

### Convenciones de nombres

Cada capa nombra sus archivos como `<entidad>.<capa>.ts`, con la entidad en
singular, tanto en backend como en frontend:

- Backend: `book.controller.ts`, `book.service.ts`, `book.routes.ts` (y lo
  mismo para `auth`, `reader`, `loan`).
- Frontend: `book.service.ts`, `reader.service.ts`, `loan.service.ts`,
  `auth.service.ts`; páginas como `<Entidad>Page.tsx` (`BooksPage.tsx`,
  `ReadersPage.tsx`, `LoansPage.tsx`, `HistoryPage.tsx`, `DashboardPage.tsx`,
  `LoginPage.tsx`).

### Estructura del repositorio

```text
BIBLIOTECH/
├── .github/workflows/ci.yml     Pipeline de integración continua
├── PLANNING.md                  Requisitos, roles y modelo de datos
├── backend/                     API REST (Node + Express + TypeScript + Prisma)
│   ├── src/
│   │   ├── config/              Configuración de entorno y cliente de Prisma
│   │   ├── controllers/         Controladores HTTP
│   │   ├── middlewares/         Autenticación, autorización y manejo de errores
│   │   ├── models/              DTOs compartidos
│   │   ├── routes/              Definición de rutas
│   │   ├── services/            Lógica de negocio
│   │   ├── utils/                JWT, errores HTTP, helpers
│   │   └── app.ts / server.ts
│   ├── prisma/                  schema.prisma, migraciones y seed
│   ├── tests/                   Pruebas unitarias con Jest + Supertest
│   └── Dockerfile
├── frontend/                     SPA (React + Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── pages/                Login, Dashboard, Libros, Lectores, Préstamos, Historial
│   │   ├── components/           Layout, rutas protegidas
│   │   ├── context/              Auth y notificaciones globales
│   │   ├── services/              Cliente Axios y llamadas a la API
│   │   └── router/
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Tecnologías

**Frontend:** React, TypeScript, Vite, React Router, Axios, Tailwind CSS.

**Backend:** Node.js, Express, TypeScript, Prisma ORM, JWT, bcrypt, CORS, dotenv.

**Base de datos:** PostgreSQL.

**DevOps:** Git, GitHub, GitHub Actions, Docker, Docker Compose.

## Modelo de datos

| Tabla        | Campos principales                                                                 |
|--------------|--------------------------------------------------------------------------------------|
| `usuarios`   | id, nombre, correo, password (hash), rol (`ADMINISTRADOR` \| `BIBLIOTECARIO`)         |
| `libros`     | id, codigo, titulo, autor, categoria, isbn, cantidadTotal, cantidadDisponible          |
| `lectores`   | id, dni, nombre, apellidos, correo, telefono                                          |
| `prestamos`  | id, libroId, lectorId, fechaPrestamo, fechaDevolucion, estado (`ACTIVO` \| `DEVUELTO`) |

## Instalación

### Requisitos

- Node.js 20+
- Docker y Docker Compose
- Git

### Clonar el repositorio

```bash
git clone https://github.com/coxclode/BIBLIOTECH.git
cd BIBLIOTECH
```

### Variables de entorno

Copiar el archivo de ejemplo y ajustar los valores según el entorno:

```bash
cp .env.example .env
```

| Variable          | Descripción                                              |
|-------------------|-----------------------------------------------------------|
| `POSTGRES_USER`     | Usuario de PostgreSQL                                     |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL                                   |
| `POSTGRES_DB`       | Nombre de la base de datos                                 |
| `POSTGRES_PORT`     | Puerto expuesto por PostgreSQL en el host                  |
| `DATABASE_URL`      | Cadena de conexión que usa Prisma                          |
| `JWT_SECRET`        | Secreto para firmar los tokens JWT                          |
| `JWT_EXPIRES_IN`    | Tiempo de expiración del token (ej. `8h`)                   |
| `PORT`              | Puerto en el que escucha el backend                         |
| `CORS_ORIGIN`       | Origen permitido para peticiones del frontend               |
| `VITE_API_URL`      | URL base de la API que consume el frontend                  |

## Ejecución con Docker (recomendado)

Levanta los tres servicios (PostgreSQL, backend y frontend) con un solo comando. El backend aplica las migraciones y ejecuta el seed inicial automáticamente al iniciar.

```bash
docker compose up -d --build
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:4000/api
- Health check del backend: http://localhost:4000/health

Para detener y eliminar los contenedores:

```bash
docker compose down
```

Para eliminar también el volumen de datos de PostgreSQL:

```bash
docker compose down -v
```

### Usuarios iniciales (seed)

| Rol            | Correo                      | Contraseña          |
|-----------------|------------------------------|-----------------------|
| Administrador   | admin@biblioteca.com          | admin123              |
| Bibliotecario   | bibliotecario@biblioteca.com  | bibliotecario123       |

## Ejecución en modo desarrollo (sin Docker)

Requiere una instancia de PostgreSQL accesible (puede levantarse solo ese servicio con `docker compose up -d postgres`).

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Pruebas

El backend incluye pruebas unitarias con Jest y Supertest que validan:

- Login con credenciales válidas e inválidas.
- Creación de libros.
- Registro de préstamos y actualización de disponibilidad.
- Rechazo de préstamos sin ejemplares disponibles.
- Registro de devoluciones.
- Validación de DNI (8 dígitos) y teléfono (9 dígitos) de los lectores.

```bash
cd backend
npm test
```

Cada corrida genera un **reporte de cobertura** (statements, branches,
functions, lines) en `backend/coverage/` (HTML navegable en
`coverage/lcov-report/index.html`), configurado en `backend/jest.config.js`.
En GitHub Actions este reporte se publica en el resumen del job y también se
sube como artefacto descargable (`backend-coverage-report`) en cada ejecución.

## Integración continua (GitHub Actions)

El workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) se ejecuta en cada push y pull request contra `main`:

1. Checkout del código.
2. Instalación de dependencias (`npm ci`).
3. Generación del cliente de Prisma y aplicación de migraciones contra un servicio de PostgreSQL efímero.
4. Ejecución de las pruebas unitarias del backend con reporte de cobertura (se publica en el resumen del job y como artefacto).
5. Compilación (`build`) de backend y frontend.

Si cualquier paso falla (incluidas las pruebas), el pipeline se detiene y marca el workflow en rojo.

## Comandos útiles

| Comando                                | Descripción                                       |
|------------------------------------------|-----------------------------------------------------|
| `docker compose up -d --build`           | Levanta todo el stack                               |
| `docker compose logs -f backend`         | Ver logs del backend                                |
| `docker compose down`                    | Detiene y elimina los contenedores                  |
| `npx prisma studio` (dentro de `backend`)| Explorar la base de datos con una UI                |
| `npx prisma migrate dev --name <nombre>` | Crear una nueva migración en desarrollo             |
| `npm test` (dentro de `backend`)         | Ejecutar las pruebas unitarias                       |

## Capturas sugeridas

Para documentar el proyecto, se recomienda incluir capturas de:

- Pantalla de login.
- Dashboard con los indicadores generales.
- Gestión de libros (listado y formulario).
- Gestión de lectores (listado y formulario).
- Registro de un préstamo.
- Historial de préstamos.

Proyecto Desarrollado con DevOps 