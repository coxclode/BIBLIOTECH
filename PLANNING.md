# Planificación — Sistema de Préstamo y Registro de Biblioteca

Este documento recoge la planificación funcional del proyecto **BIBLIOTECH**,
tal como fue definida antes de la implementación y tal como quedó reflejada en
el código actual. Sirve como evidencia de la etapa **Plan** del ciclo DevOps.

## 1. Objetivo del sistema

Digitalizar el préstamo y registro de una biblioteca: catálogo de libros,
registro de lectores, préstamos con control de disponibilidad, devoluciones e
historial, con acceso restringido por rol de usuario.

## 2. Roles de usuario

El sistema distingue dos tipos de actor:

| Actor | Tiene login | Permisos |
|---|---|---|
| **Administrador** | Sí (JWT) | Todo lo del Bibliotecario, además de eliminar libros y lectores. |
| **Bibliotecario** | Sí (JWT) | Consultar, crear y actualizar libros/lectores, registrar préstamos y devoluciones. |
| **Lector** | No | No es un usuario del sistema; es la entidad sobre la que se registran los préstamos (no inicia sesión). |

La autorización por rol se aplica a nivel de ruta en el backend
(`backend/src/middlewares/auth.middleware.ts`, función `authorize`), por
ejemplo `DELETE /api/libros/:id` solo está permitido para `ADMINISTRADOR`
(`backend/src/routes/book.routes.ts`).

## 3. Requisitos funcionales

1. **Autenticación** — login con correo y contraseña, devuelve un JWT válido
   por `JWT_EXPIRES_IN` (por defecto 8h). Rutas protegidas exigen
   `Authorization: Bearer <token>`.
2. **Gestión de libros** — CRUD completo (código, título, autor, categoría,
   ISBN, cantidad total, cantidad disponible). La cantidad disponible nunca
   puede quedar por debajo de los ejemplares actualmente prestados.
3. **Gestión de lectores** — CRUD completo (DNI de 8 dígitos numéricos,
   nombre, apellidos, correo, teléfono de 9 dígitos numéricos).
4. **Préstamos** — al registrar un préstamo se valida que el lector exista,
   que el libro exista y que tenga disponibilidad (> 0); la disponibilidad se
   descuenta atómicamente (transacción de base de datos).
5. **Devoluciones** — restauran la disponibilidad del libro y marcan el
   préstamo como `DEVUELTO` con su fecha; no se puede devolver dos veces el
   mismo préstamo.
6. **Historial** — listado de todos los préstamos (activos y devueltos) con
   libro, lector, fecha de préstamo, fecha de devolución y estado.

## 4. Modelo de datos

Definido en `backend/prisma/schema.prisma`.

```
Usuario
├── id            Int (PK)
├── nombre         String
├── correo         String (unique)
├── password       String (hash bcrypt)
├── rol            Rol { ADMINISTRADOR | BIBLIOTECARIO }
└── timestamps

Libro
├── id                  Int (PK)
├── codigo              String (unique)
├── titulo              String
├── autor               String
├── categoria           String
├── isbn                String (unique)
├── cantidadTotal       Int
├── cantidadDisponible  Int
└── timestamps

Lector
├── id          Int (PK)
├── dni         String (unique, 8 dígitos)
├── nombre      String
├── apellidos   String
├── correo      String (unique)
├── telefono    String (9 dígitos)
└── timestamps

Prestamo
├── id               Int (PK)
├── libroId          Int (FK -> Libro)
├── lectorId         Int (FK -> Lector)
├── fechaPrestamo    DateTime
├── fechaDevolucion  DateTime? (nullable)
├── estado           EstadoPrestamo { ACTIVO | DEVUELTO }
└── timestamps
```

Relaciones: un `Libro` puede tener muchos `Prestamo`; un `Lector` puede tener
muchos `Prestamo`. Un `Prestamo` pertenece exactamente a un `Libro` y un
`Lector`.

## 5. Alcance excluido (fuera de esta versión)

- Multas por retraso o límites de fecha de devolución.
- Reservas de libros no disponibles.
- Recuperación de contraseña / registro de nuevos usuarios desde la UI.
- Roles adicionales (solo Administrador y Bibliotecario).

## 6. Evidencia de implementación

| Requisito | Dónde está implementado |
|---|---|
| Autenticación JWT | `backend/src/services/auth.service.ts`, `backend/src/middlewares/auth.middleware.ts` |
| CRUD libros | `backend/src/services/book.service.ts`, `frontend/src/pages/BooksPage.tsx` |
| CRUD lectores | `backend/src/services/reader.service.ts`, `frontend/src/pages/ReadersPage.tsx` |
| Préstamos/devoluciones | `backend/src/services/loan.service.ts`, `frontend/src/pages/LoansPage.tsx` |
| Historial | `frontend/src/pages/HistoryPage.tsx` |
| Modelo de datos | `backend/prisma/schema.prisma` |
| Pruebas que validan lo anterior | `backend/tests/*.test.ts` |
