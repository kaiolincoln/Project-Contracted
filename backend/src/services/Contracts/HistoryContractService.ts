import prismaClient from "../../prisma/index";

interface HistoryContractRequest {
  contract_id: string;
}

class HistoryContractService {
  async execute({ contract_id }: HistoryContractRequest) {

    const contractExists = await prismaClient.contract.findUnique({
      where: { id: contract_id },
      select: { id: true, title: true, number: true }
    });

    if (!contractExists) {
      throw new Error("Contrato não encontrado");
    }

    const history = await prismaClient.contractHistory.findMany({
      where: { contractId: contract_id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        action: true,
        detail: true,
        createdAt: true,
        user: {
          select: { id: true, name: true }
        }
      }
    });

    return {
      contract: contractExists,
      history,
    };
  }
}

export { HistoryContractService };