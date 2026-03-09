import { Request, Response } from "express";
import { DetailClientService } from "../../services/Clients/DetailClientService";

class DetailClientController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const detailClientService = new DetailClientService();
    const client = await detailClientService.execute({ client_id: id as string});

    res.json(client);
  }
}

export { DetailClientController };