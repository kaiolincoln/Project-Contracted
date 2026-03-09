import { Request, Response } from "express";
import { DeleteClientService } from "../../services/Clients/DeleteClientService";

class DeleteClientController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteClientService = new DeleteClientService();

    await deleteClientService.execute({ client_id: id as string });

    res.json({ message: "Cliente removido com sucesso" });
  }
}

export { DeleteClientController };