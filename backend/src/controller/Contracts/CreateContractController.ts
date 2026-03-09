import { Request, Response } from "express";
import { CreateContractService } from "../../services/Contracts/CreateContractService";

class CreateContractController {
  async handle(req: Request, res: Response) {
    const { title, number, value, startDate, endDate, description, clientId } = req.body;
    const responsible_id = req.user_id;

    const createContractService = new CreateContractService();

    const contract = await createContractService.execute({
      title,
      number,
      value,
      startDate,
      endDate,
      description,
      clientId,
      responsibleId: responsible_id as string,
    });

    res.json(contract);
  }
}

export { CreateContractController };