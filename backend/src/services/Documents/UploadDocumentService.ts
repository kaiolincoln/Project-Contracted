import prismaClient from "../../prisma/index";

interface UploadDocumentRequest {
  contract_id: string;
  user_id: string;
  filename: string;
  originalname: string;
  size: number;
}

class UploadDocumentService {
  async execute({ contract_id, user_id, filename, originalname, size }: UploadDocumentRequest) {

    const contractExists = await prismaClient.contract.findUnique({
      where: { id: contract_id }
    });

    if (!contractExists) {
      throw new Error("Contrato não encontrado");
    }

    const document = await prismaClient.document.create({
      data: {
        name: originalname,
        url: `/uploads/${filename}`,
        size,
        contractId: contract_id,
      }
    });

    // Registra no histórico
    await prismaClient.contractHistory.create({
      data: {
        action: "DOC_UPLOADED",
        detail: `Arquivo "${originalname}" anexado ao contrato`,
        contractId: contract_id,
        userId: user_id,
      }
    });

    return document;
  }
}

export { UploadDocumentService };