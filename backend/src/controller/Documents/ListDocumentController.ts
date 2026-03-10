import { Request, Response } from "express";
import { ListDocumentService } from "../../services/Documents/ListDocumentService";

class ListDocumentController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const listDocumentService = new ListDocumentService();
    const documents = await listDocumentService.execute({ contract_id: id as string});

    res.json(documents);
  }
}

export { ListDocumentController };