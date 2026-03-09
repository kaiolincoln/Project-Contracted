import prismaClient from "../../prisma/index";

interface DetailContractRequest {
  contract_id: string;
}

class DetailContractService {
  async execute({ contract_id }: DetailContractRequest) {

    const contract = await prismaClient.contract.findUnique({
      where: { id: contract_id },
      include: {
        client: {
          select: { id: true, name: true, document: true, email: true, phone: true }
        },
        responsible: {
          select: { id: true, name: true, email: true }
        },
        documents: {
          select: { id: true, name: true, url: true, size: true, createdAt: true }
        },
        history: {
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
        }
      }
    });

    if (!contract) {
      throw new Error("Contrato não encontrado");
    }

    return contract;
  }
}

export { DetailContractService };