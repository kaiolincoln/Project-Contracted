import { Request, Response } from "express";
import { DetailContractService } from "../../services/Contracts/DetailContractService";

class DetailContractController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const detailContractService = new DetailContractService();

    const contract = await detailContractService.execute({ contract_id: id as string});

    res.json(contract);
  }
}

export { DetailContractController };