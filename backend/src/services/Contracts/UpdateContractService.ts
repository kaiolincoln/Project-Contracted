import prismaClient from "../../prisma/index";

interface UpdateContractRequest {
  contract_id: string;
  user_id: string;
  title?: string;
  value?: number;
  startDate?: string;
  endDate?: string;
  description?: string;
  clientId?: string;
}

class UpdateContractService {
  async execute({
    contract_id,
    user_id,
    title,
    value,
    startDate,
    endDate,
    description,
    clientId,
  }: UpdateContractRequest) {

    const contractExists = await prismaClient.contract.findUnique({
      where: { id: contract_id }
    });

    if (!contractExists) {
      throw new Error("Contrato não encontrado");
    }

    if (clientId) {
      const clientExists = await prismaClient.client.findUnique({
        where: { id: clientId }
      });

      if (!clientExists) {
        throw new Error("Cliente não encontrado");
      }
    }

    const changes: string[] = [];
    if (title && title !== contractExists.title) changes.push(`Título alterado`);
    if (value && Number(value) !== Number(contractExists.value)) changes.push(`Valor alterado`);
    if (clientId && clientId !== contractExists.clientId) changes.push(`Cliente alterado`);
    if (startDate) changes.push(`Data de início alterada`);
    if (endDate) changes.push(`Data de término alterada`);

    const contract = await prismaClient.contract.update({
      where: { id: contract_id },
      data: {
        title: title ?? contractExists.title,
        value: value ?? contractExists.value,
        startDate: startDate ? new Date(startDate) : contractExists.startDate,
        endDate: endDate ? new Date(endDate) : contractExists.endDate,
        description: description ?? contractExists.description,
        clientId: clientId ?? contractExists.clientId,
      },
      include: {
        client: {
          select: { id: true, name: true, document: true }
        },
        responsible: {
          select: { id: true, name: true }
        }
      }
    });

    if (changes.length > 0) {
      await prismaClient.contractHistory.create({
        data: {
          action: "VALUE_UPDATED",
          detail: changes.join(", "),
          contractId: contract_id,
          userId: user_id,
        }
      });
    }

    return contract;
  }
}

export { UpdateContractService };