import { Request, Response } from "express";
import { UpdateClientService } from "../../services/Clients/UpdateClientService";

class UpdateClientController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const updateClientService = new UpdateClientService();

    const client = await updateClientService.execute({
      client_id: id as string,
      name,
      email,
      phone,
      address,
    });

    res.json(client);
  }
}

export { UpdateClientController };