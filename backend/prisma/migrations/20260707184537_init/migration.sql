-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRADOR', 'BIBLIOTECARIO');

-- CreateEnum
CREATE TYPE "EstadoPrestamo" AS ENUM ('ACTIVO', 'DEVUELTO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'BIBLIOTECARIO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "libros" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "cantidadTotal" INTEGER NOT NULL,
    "cantidadDisponible" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "libros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lectores" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lectores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prestamos" (
    "id" SERIAL NOT NULL,
    "libroId" INTEGER NOT NULL,
    "lectorId" INTEGER NOT NULL,
    "fechaPrestamo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaDevolucion" TIMESTAMP(3),
    "estado" "EstadoPrestamo" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prestamos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "libros_codigo_key" ON "libros"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "libros_isbn_key" ON "libros"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "lectores_dni_key" ON "lectores"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "lectores_correo_key" ON "lectores"("correo");

-- AddForeignKey
ALTER TABLE "prestamos" ADD CONSTRAINT "prestamos_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "libros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prestamos" ADD CONSTRAINT "prestamos_lectorId_fkey" FOREIGN KEY ("lectorId") REFERENCES "lectores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
