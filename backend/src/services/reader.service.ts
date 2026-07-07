import { prisma } from "../config/prisma";
import { NotFoundError } from "../utils/httpError";
import { ActualizarLectorDTO, CrearLectorDTO } from "../models/dto";

export async function listarLectores() {
  return prisma.lector.findMany({ orderBy: { id: "asc" } });
}

export async function obtenerLector(id: number) {
  const lector = await prisma.lector.findUnique({ where: { id } });
  if (!lector) {
    throw new NotFoundError("Lector no encontrado");
  }
  return lector;
}

export async function crearLector(data: CrearLectorDTO) {
  return prisma.lector.create({ data });
}

export async function actualizarLector(id: number, data: ActualizarLectorDTO) {
  await obtenerLector(id);
  return prisma.lector.update({ where: { id }, data });
}

export async function eliminarLector(id: number) {
  await obtenerLector(id);
  await prisma.lector.delete({ where: { id } });
}
