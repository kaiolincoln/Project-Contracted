import { Request, Response } from "express";
import { CreateClientService } from "../../services/Clients/CreateClientService";

class CreateClientController {
  async handle(req: Request, res: Response) {
    const { name, document, email, phone, address } = req.body;

    const createClientService = new CreateClientService();

    const client = await createClientService.execute({
      name,
      document,
      email,
      phone,
      address,
    });

    res.json(client);
  }
}

export { CreateClientController };