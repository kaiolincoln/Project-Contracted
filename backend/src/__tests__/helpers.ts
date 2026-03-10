import  prismaClient  from "../prisma/index";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function createAdminUser() {
  const passwordHash = await hash("Senha123", 8);

  const user = await prismaClient.user.create({
    data: {
      name: "Admin Teste",
      email: "admin@teste.com",
      password: passwordHash,
      role: "ADMIN",
    }
  });

  const token = sign(
    { name: user.name, email: user.email },
    process.env.JWT_SECRET as string,
    { subject: user.id, expiresIn: "1d" }
  );

  return { user, token };
}

export async function createEditorUser() {
  const passwordHash = await hash("Senha123", 8);

  const user = await prismaClient.user.create({
    data: {
      name: "Editor Teste",
      email: "editor@teste.com",
      password: passwordHash,
      role: "EDITOR",
    }
  });

  const token = sign(
    { name: user.name, email: user.email },
    process.env.JWT_SECRET as string,
    { subject: user.id, expiresIn: "1d" }
  );

  return { user, token };
}

export async function createClient() {
  return await prismaClient.client.create({
    data: {
      name: "Cliente Teste",
      document: "12345678000190",
      email: "cliente@teste.com",
      phone: "3199999999",
    }
  });
}