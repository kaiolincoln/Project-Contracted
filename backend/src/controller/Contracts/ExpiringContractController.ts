import { Request, Response } from "express";
import { ExpiringContractService } from "../../services/Contracts/ExpiringContractService";

class ExpiringContractController {
  async handle(req: Request, res: Response) {
    const expiringContractService = new ExpiringContractService();
    const contracts = await expiringContractService.execute();
    res.json(contracts);
  }
}

export { ExpiringContractController };