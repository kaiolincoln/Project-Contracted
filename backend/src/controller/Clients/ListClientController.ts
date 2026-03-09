import { Request, Response } from "express";
import { ListClientService } from "../../services/Clients/ListClientService";

class ListClientController {
  async handle(req: Request, res: Response) {
    const listClientService = new ListClientService();
    const clients = await listClientService.execute();
    res.json(clients);
  }
}

export { ListClientController };