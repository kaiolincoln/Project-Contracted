import prismaClient from "../../prisma/index";

interface CreateContractRequest {
  title: string;
  number: string;
  value: number;
  startDate: string;
  endDate: string;
  description?: string;
  clientId: string;
  responsibleId: string;
}

class CreateContractService {
  async execute({
    title,
    number,
    value,
    startDate,
    endDate,
    description,
    clientId,
    responsibleId,
  }: CreateContractRequest) {

    const contractExists = await prismaClient.contract.findUnique({
      where: { number }
    });

    if (contractExists) {
      throw new Error("Já existe um contrato com esse número");
    }

    const clientExists = await prismaClient.client.findUnique({
      where: { id: clientId }
    });

    if (!clientExists) {
      throw new Error("Cliente não encontrado");
    }

    const contract = await prismaClient.contract.create({
      data: {
        title,
        number,
        value,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        clientId,
        responsibleId,
        status: "ACTIVE",
      },
      include: {
        client: {
          select: { id: true, name: true, document: true }
        },
        responsible: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    await prismaClient.contractHistory.create({
      data: {
        action: "CONTRACT_CREATED",
        detail: `Contrato ${number} criado com status ACTIVE`,
        contractId: contract.id,
        userId: responsibleId,
      }
    });

    return contract;
  }
}

export { CreateContractService };