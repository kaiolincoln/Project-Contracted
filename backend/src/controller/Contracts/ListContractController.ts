import { Request, Response } from "express";
import { ListContractService } from "../../services/Contracts/ListContractService";

class ListContractController {
  async handle(req: Request, res: Response) {
    const listContractService = new ListContractService();
    const contracts = await listContractService.execute();
    res.json(contracts);
  }
}

export { ListContractController };