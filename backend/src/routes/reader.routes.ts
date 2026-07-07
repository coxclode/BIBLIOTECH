import { Router } from "express";
import { Rol } from "@prisma/client";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  actualizarLectorHandler,
  crearLectorHandler,
  eliminarLectorHandler,
  listarLectoresHandler,
  obtenerLectorHandler,
} from "../controllers/reader.controller";

const router = Router();

router.use(authenticate);

router.get("/", listarLectoresHandler);
router.get("/:id", obtenerLectorHandler);
router.post("/", authorize(Rol.ADMINISTRADOR, Rol.BIBLIOTECARIO), crearLectorHandler);
router.put("/:id", authorize(Rol.ADMINISTRADOR, Rol.BIBLIOTECARIO), actualizarLectorHandler);
router.delete("/:id", authorize(Rol.ADMINISTRADOR), eliminarLectorHandler);

export default router;
