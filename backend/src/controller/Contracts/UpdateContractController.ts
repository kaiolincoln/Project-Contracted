import { Request, Response } from "express";
import { UpdateContractService } from "../../services/Contracts/UpdateContractService";

class UpdateContractController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { title, value, startDate, endDate, description, clientId } = req.body;
    const user_id = req.user_id;

    const updateContractService = new UpdateContractService();

    const contract = await updateContractService.execute({
      contract_id: id as string,
      user_id: user_id as string,
      title,
      value,
      startDate,
      endDate,
      description,
      clientId,
    });

    res.json(contract);
  }
}

export { UpdateContractController };