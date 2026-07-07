import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { HttpError } from "../utils/httpError";

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({ message: "Ya existe un registro con ese valor único" });
      return;
    }
    if (error.code === "P2025") {
      res.status(404).json({ message: "Registro no encontrado" });
      return;
    }
  }

  console.error(error);
  res.status(500).json({ message: "Error interno del servidor" });
}
