import prismaClient from "../../prisma/index";

interface UpdateClientRequest {
  client_id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

class UpdateClientService {
  async execute({ client_id, name, email, phone, address }: UpdateClientRequest) {

    const clientExists = await prismaClient.client.findUnique({
      where: { id: client_id }
    });

    if (!clientExists) {
      throw new Error("Cliente não encontrado");
    }

    const client = await prismaClient.client.update({
      where: { id: client_id },
      data: {
        name: name ?? clientExists.name,
        email: email ?? clientExists.email,
        phone: phone ?? clientExists.phone,
        address: address ?? clientExists.address,
      }
    });

    return client;
  }
}

export { UpdateClientService };