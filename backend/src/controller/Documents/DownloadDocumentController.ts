import { Request, Response } from "express";
import { DownloadDocumentService } from "../../services/Documents/DownloadDocumentService";
import fs from "fs";

class DownloadDocumentController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const downloadDocumentService = new DownloadDocumentService();

    const { filePath, name } = await downloadDocumentService.execute({
      document_id: id as string,
    });

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Arquivo não encontrado no servidor" });
    }

    return res.download(filePath, name);
  }
}

export { DownloadDocumentController };