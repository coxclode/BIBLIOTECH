import { prisma } from "../config/prisma";
import { BadRequestError, NotFoundError } from "../utils/httpError";
import { ActualizarLectorDTO, CrearLectorDTO } from "../models/dto";

const DNI_REGEX = /^\d{8}$/;
const TELEFONO_REGEX = /^\d{9}$/;

function validarDni(dni: string) {
  if (!DNI_REGEX.test(dni)) {
    throw new BadRequestError("El DNI debe contener exactamente 8 dígitos numéricos");
  }
}

function validarTelefono(telefono: string) {
  if (!TELEFONO_REGEX.test(telefono)) {
    throw new BadRequestError("El teléfono debe contener exactamente 9 dígitos numéricos");
  }
}

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
  validarDni(data.dni);
  validarTelefono(data.telefono);
  return prisma.lector.create({ data });
}

export async function actualizarLector(id: number, data: ActualizarLectorDTO) {
  await obtenerLector(id);
  if (data.dni !== undefined) validarDni(data.dni);
  if (data.telefono !== undefined) validarTelefono(data.telefono);
  return prisma.lector.update({ where: { id }, data });
}

export async function eliminarLector(id: number) {
  await obtenerLector(id);
  await prisma.lector.delete({ where: { id } });
}
