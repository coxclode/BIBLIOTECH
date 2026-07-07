import { EstadoPrestamo } from "@prisma/client";
import { prisma } from "../config/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/httpError";
import { CrearPrestamoDTO } from "../models/dto";

export async function listarPrestamos() {
  return prisma.prestamo.findMany({
    include: { libro: true, lector: true },
    orderBy: { id: "desc" },
  });
}

export async function obtenerPrestamo(id: number) {
  const prestamo = await prisma.prestamo.findUnique({
    where: { id },
    include: { libro: true, lector: true },
  });

  if (!prestamo) {
    throw new NotFoundError("Préstamo no encontrado");
  }

  return prestamo;
}

export async function crearPrestamo(data: CrearPrestamoDTO) {
  if (!data.libroId || !data.lectorId) {
    throw new BadRequestError("El libro y el lector son requeridos");
  }

  return prisma.$transaction(async (tx) => {
    const lector = await tx.lector.findUnique({ where: { id: data.lectorId } });
    if (!lector) {
      throw new NotFoundError("El lector no existe");
    }

    const libro = await tx.libro.findUnique({ where: { id: data.libroId } });
    if (!libro) {
      throw new NotFoundError("El libro no existe");
    }

    if (libro.cantidadDisponible <= 0) {
      throw new ConflictError("No hay ejemplares disponibles para este libro");
    }

    await tx.libro.update({
      where: { id: libro.id },
      data: { cantidadDisponible: { decrement: 1 } },
    });

    return tx.prestamo.create({
      data: {
        libroId: data.libroId,
        lectorId: data.lectorId,
        estado: EstadoPrestamo.ACTIVO,
      },
      include: { libro: true, lector: true },
    });
  });
}

export async function registrarDevolucion(id: number) {
  return prisma.$transaction(async (tx) => {
    const prestamo = await tx.prestamo.findUnique({ where: { id } });

    if (!prestamo) {
      throw new NotFoundError("Préstamo no encontrado");
    }

    if (prestamo.estado === EstadoPrestamo.DEVUELTO) {
      throw new ConflictError("Este préstamo ya fue devuelto");
    }

    await tx.libro.update({
      where: { id: prestamo.libroId },
      data: { cantidadDisponible: { increment: 1 } },
    });

    return tx.prestamo.update({
      where: { id },
      data: {
        estado: EstadoPrestamo.DEVUELTO,
        fechaDevolucion: new Date(),
      },
      include: { libro: true, lector: true },
    });
  });
}
