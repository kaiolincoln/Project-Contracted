import prismaClient from "../../prisma/index";

interface ListDocumentRequest {
  contract_id: string;
}

class ListDocumentService {
  async execute({ contract_id }: ListDocumentRequest) {

    const contractExists = await prismaClient.contract.findUnique({
      where: { id: contract_id }
    });

    if (!contractExists) {
      throw new Error("Contrato não encontrado");
    }

    const documents = await prismaClient.document.findMany({
      where: { contractId: contract_id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        url: true,
        size: true,
        createdAt: true,
      }
    });

    return documents;
  }
}

export { ListDocumentService };