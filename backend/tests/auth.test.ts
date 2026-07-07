import request from "supertest";
import bcrypt from "bcrypt";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";
import { limpiarBaseDeDatos } from "./helpers";

const app = createApp();

describe("Autenticación", () => {
  beforeAll(async () => {
    await limpiarBaseDeDatos();
    const password = await bcrypt.hash("clave123", 4);
    await prisma.usuario.create({
      data: { nombre: "Admin Test", correo: "auth-test@biblioteca.com", password, rol: "ADMINISTRADOR" },
    });
  });

  afterAll(async () => {
    await limpiarBaseDeDatos();
    await prisma.$disconnect();
  });

  it("debe iniciar sesión con credenciales válidas y devolver un token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ correo: "auth-test@biblioteca.com", password: "clave123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.usuario.correo).toBe("auth-test@biblioteca.com");
  });

  it("debe rechazar credenciales inválidas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ correo: "auth-test@biblioteca.com", password: "clave-incorrecta" });

    expect(res.status).toBe(401);
  });

  it("debe rechazar el login si faltan campos", async () => {
    const res = await request(app).post("/api/auth/login").send({ correo: "auth-test@biblioteca.com" });

    expect(res.status).toBe(400);
  });
});
