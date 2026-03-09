import prismaClient from "../../prisma/index";

interface CreateClientRequest {
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
}

class CreateClientService {
  async execute({ name, document, email, phone, address }: CreateClientRequest) {

    // Verifica se já existe cliente com esse CPF/CNPJ
    const clientExists = await prismaClient.client.findUnique({
      where: { document }
    });

    if (clientExists) {
      throw new Error("Já existe um cliente com esse CPF/CNPJ");
    }

    const client = await prismaClient.client.create({
      data: {
        name,
        document,
        email,
        phone,
        address,
      }
    });

    return client;
  }
}

export { CreateClientService };