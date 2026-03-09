import { Request, Response } from "express";
import { UpdateStatusContractService } from "../../services/Contracts/UpdateStatusContractService";

class UpdateStatusContractController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user_id;

    const updateStatusContractService = new UpdateStatusContractService();

    const contract = await updateStatusContractService.execute({
      contract_id: id as string,
      user_id: user_id as string,
      status,
    });

    res.json(contract);
  }
}

export { UpdateStatusContractController };