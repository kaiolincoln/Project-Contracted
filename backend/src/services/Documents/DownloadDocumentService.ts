import prismaClient from "../../prisma/index";
import path from "path";

interface DownloadDocumentRequest {
  document_id: string;
}

class DownloadDocumentService {
  async execute({ document_id }: DownloadDocumentRequest) {

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

    return { filePath, name: document.name };
  }
}

export { DownloadDocumentService };