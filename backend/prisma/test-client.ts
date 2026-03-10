import { PrismaClient } from "../../generated/prisma-test";

const prismaTest = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST
    }
  }
});

export { prismaTest };