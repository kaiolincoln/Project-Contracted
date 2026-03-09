import prismaClient from "../../prisma/index";

interface DetailClientRequest {
  client_id: string;
}

class DetailClientService {
  async execute({ client_id }: DetailClientRequest) {

    const client = await prismaClient.client.findUnique({
      where: { id: client_id },
      select: {
        id: true,
        name: true,
        document: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    return client;
  }
}

export { DetailClientService };