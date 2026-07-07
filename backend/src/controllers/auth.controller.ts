import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { BadRequestError } from "../utils/httpError";
import * as authService from "../services/auth.service";

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { correo, password } = req.body as { correo?: string; password?: string };

  if (!correo || !password) {
    throw new BadRequestError("Correo y contraseña son requeridos");
  }

  const result = await authService.login(correo, password);
  res.status(200).json(result);
});
