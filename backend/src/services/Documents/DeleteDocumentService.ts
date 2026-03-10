import prismaClient from "../../prisma/index";
import fs from "fs";
import path from "path";

interface DeleteDocumentRequest {
  document_id: string;
  user_id: string;
}

class DeleteDocumentService {
  async execute({ document_id, user_id }: DeleteDocumentRequest) {

    const document = await prismaClient.document.findUnique({
      where: { id: document_id }
    });

    if (!document) {
      throw new Error("Documento não encontrado");
    }

    const filePath = path.resolve(
      __dirname, "..", "..", "tmp", "uploads",
      path.basename(document.url)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prismaClient.contractHistory.create({
      data: {
        action: "DOC_DELETED",
        detail: `Arquivo "${document.name}" removido do contrato`,
        contractId: document.contractId,
        userId: user_id,
      }
    });

    await prismaClient.document.delete({
      where: { id: document_id }
    });
  }
}

export { DeleteDocumentService };