import bcrypt from "bcrypt";
import { Rol } from "@prisma/client";
import { prisma } from "../src/config/prisma";
import { signToken } from "../src/utils/jwt";

export async function crearUsuarioDePrueba(correo: string, rol: Rol = Rol.ADMINISTRADOR) {
  const password = await bcrypt.hash("password123", 4);
  const usuario = await prisma.usuario.create({
    data: { nombre: "Usuario de Prueba", correo, password, rol },
  });
  const token = signToken({ sub: usuario.id, correo: usuario.correo, rol: usuario.rol });
  return { usuario, token };
}

export async function limpiarBaseDeDatos() {
  await prisma.prestamo.deleteMany();
  await prisma.libro.deleteMany();
  await prisma.lector.deleteMany();
  await prisma.usuario.deleteMany();
}
