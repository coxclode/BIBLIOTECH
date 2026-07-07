import { NextFunction, Request, Response } from "express";
import { Rol } from "@prisma/client";
import { verifyToken, AuthTokenPayload } from "../utils/jwt";
import { UnauthorizedError, ForbiddenError } from "../utils/httpError";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token de autenticación no proporcionado");
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw new UnauthorizedError("Token inválido o expirado");
  }
}

export function authorize(...allowedRoles: Rol[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!allowedRoles.includes(req.user.rol)) {
      throw new ForbiddenError("No tienes permisos para realizar esta acción");
    }

    next();
  };
}
