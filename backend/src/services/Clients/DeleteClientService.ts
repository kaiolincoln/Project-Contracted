import prismaClient from "../../prisma/index";

interface DeleteClientRequest {
  client_id: string;
}

class DeleteClientService {
  async execute({ client_id }: DeleteClientRequest) {

    const clientExists = await prismaClient.client.findUnique({
      where: { id: client_id }
    });

    if (!clientExists) {
      throw new Error("Cliente não encontrado");
    }

    await prismaClient.client.delete({
      where: { id: client_id }
    });
  }
}

export { DeleteClientService };