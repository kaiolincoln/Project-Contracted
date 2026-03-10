import { Request, Response } from "express";
import { DeleteDocumentService } from "../../services/Documents/DeleteDocumentService";

class DeleteDocumentController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const user_id = req.user_id;

    const deleteDocumentService = new DeleteDocumentService();

    await deleteDocumentService.execute({
      document_id: id as string,
      user_id: user_id as string,
    });

    res.json({ message: "Documento removido com sucesso" });
  }
}

export { DeleteDocumentController };