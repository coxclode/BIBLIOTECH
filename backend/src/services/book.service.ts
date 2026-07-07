import { prisma } from "../config/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/httpError";
import { ActualizarLibroDTO, CrearLibroDTO } from "../models/dto";

export async function listarLibros() {
  return prisma.libro.findMany({ orderBy: { id: "asc" } });
}

export async function obtenerLibro(id: number) {
  const libro = await prisma.libro.findUnique({ where: { id } });
  if (!libro) {
    throw new NotFoundError("Libro no encontrado");
  }
  return libro;
}

export async function crearLibro(data: CrearLibroDTO) {
  if (data.cantidadTotal < 0) {
    throw new BadRequestError("La cantidad total no puede ser negativa");
  }

  return prisma.libro.create({
    data: {
      codigo: data.codigo,
      titulo: data.titulo,
      autor: data.autor,
      categoria: data.categoria,
      isbn: data.isbn,
      cantidadTotal: data.cantidadTotal,
      cantidadDisponible: data.cantidadTotal,
    },
  });
}

export async function actualizarLibro(id: number, data: ActualizarLibroDTO) {
  const libro = await obtenerLibro(id);

  let cantidadDisponible = libro.cantidadDisponible;

  if (data.cantidadTotal !== undefined) {
    if (data.cantidadTotal < 0) {
      throw new BadRequestError("La cantidad total no puede ser negativa");
    }

    const prestados = libro.cantidadTotal - libro.cantidadDisponible;
    if (data.cantidadTotal < prestados) {
      throw new ConflictError(
        "La nueva cantidad total no puede ser menor que la cantidad de ejemplares actualmente prestados"
      );
    }
    cantidadDisponible = data.cantidadTotal - prestados;
  }

  return prisma.libro.update({
    where: { id },
    data: {
      codigo: data.codigo,
      titulo: data.titulo,
      autor: data.autor,
      categoria: data.categoria,
      isbn: data.isbn,
      cantidadTotal: data.cantidadTotal,
      cantidadDisponible,
    },
  });
}

export async function eliminarLibro(id: number) {
  await obtenerLibro(id);
  await prisma.libro.delete({ where: { id } });
}
