import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../app";

describe("POST /users — Criar usuário", () => {

  it("deve criar um usuário com dados válidos", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "João Silva",
        email: "joao@email.com",
        password: "Senha123"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("joao@email.com");
    expect(response.body).not.toHaveProperty("password");
  });

  it("deve retornar erro com email duplicado", async () => {
    await request(app).post("/users").send({
      name: "João Silva",
      email: "joao@email.com",
      password: "Senha@123"
    });

    const response = await request(app)
      .post("/users")
      .send({
        name: "João 2",
        email: "joao22@email.com",
        password: "Senha@123"
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("deve retornar erro sem campos obrigatórios", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "João Silva"
      });

    expect(response.status).toBe(400);
  });

});