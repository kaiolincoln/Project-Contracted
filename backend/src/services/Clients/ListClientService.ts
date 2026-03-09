import prismaClient from "../../prisma/index";

class ListClientService {
  async execute() {
    const clients = await prismaClient.client.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        document: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
      }
    });

    return clients;
  }
}

export { ListClientService };