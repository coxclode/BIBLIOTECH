import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";
import { crearUsuarioDePrueba, limpiarBaseDeDatos } from "./helpers";

const app = createApp();

describe("Gestión de lectores", () => {
  let token: string;

  beforeAll(async () => {
    await limpiarBaseDeDatos();
    const usuario = await crearUsuarioDePrueba("readers-test@biblioteca.com");
    token = usuario.token;
  });

  afterAll(async () => {
    await limpiarBaseDeDatos();
    await prisma.$disconnect();
  });

  it("debe crear un lector con DNI de 8 dígitos y teléfono de 9 dígitos", async () => {
    const res = await request(app)
      .post("/api/lectores")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dni: "12345678",
        nombre: "Lucía",
        apellidos: "Gómez",
        correo: "lucia@example.com",
        telefono: "912345678",
      });

    expect(res.status).toBe(201);
    expect(res.body.dni).toBe("12345678");
    expect(res.body.telefono).toBe("912345678");
  });

  it("no debe crear un lector con DNI que no tenga exactamente 8 dígitos", async () => {
    const res = await request(app)
      .post("/api/lectores")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dni: "123456",
        nombre: "Mario",
        apellidos: "Ríos",
        correo: "mario@example.com",
        telefono: "912345678",
      });

    expect(res.status).toBe(400);
  });

  it("no debe crear un lector con DNI que contenga letras", async () => {
    const res = await request(app)
      .post("/api/lectores")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dni: "1234567A",
        nombre: "Sara",
        apellidos: "Luna",
        correo: "sara@example.com",
        telefono: "912345678",
      });

    expect(res.status).toBe(400);
  });

  it("no debe crear un lector con teléfono que no tenga exactamente 9 dígitos", async () => {
    const res = await request(app)
      .post("/api/lectores")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dni: "87654321",
        nombre: "Iván",
        apellidos: "Soto",
        correo: "ivan@example.com",
        telefono: "123",
      });

    expect(res.status).toBe(400);
  });
});
