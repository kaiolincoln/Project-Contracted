import { Request, Response } from "express";
import { UploadDocumentService } from "../../services/Documents/UploadDocumentService";

class UploadDocumentController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const user_id = req.user_id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const uploadDocumentService = new UploadDocumentService();

    const document = await uploadDocumentService.execute({
      contract_id: id as string,
      user_id: user_id as string,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
    });

    return res.json(document);
  }
}

export { UploadDocumentController };