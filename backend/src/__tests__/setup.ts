import { beforeAll, beforeEach, afterAll } from "vitest";
import { config } from "dotenv";


config({ path: ".env.test" });

import prismaClient from "../prisma/index";

beforeAll(async () => {
  await prismaClient.$connect();
});

beforeEach(async () => {
  await prismaClient.notification.deleteMany();
  await prismaClient.contractHistory.deleteMany();
  await prismaClient.document.deleteMany();
  await prismaClient.contract.deleteMany();
  await prismaClient.client.deleteMany();
  await prismaClient.user.deleteMany();
});

afterAll(async () => {
  await prismaClient.$disconnect();
});