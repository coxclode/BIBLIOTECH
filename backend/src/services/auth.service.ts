import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { signToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/httpError";

export interface LoginResult {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
  };
}

export async function login(correo: string, password: string): Promise<LoginResult> {
  const usuario = await prisma.usuario.findUnique({ where: { correo } });

  if (!usuario) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);

  if (!passwordValida) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const token = signToken({ sub: usuario.id, correo: usuario.correo, rol: usuario.rol });

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    },
  };
}
