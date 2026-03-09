import { Request, Response } from "express";
import { HistoryContractService } from "../../services/Contracts/HistoryContractService";

class HistoryContractController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const historyContractService = new HistoryContractService();

    const history = await historyContractService.execute({ contract_id: id as string });

    res.json(history);
  }
}

export { HistoryContractController };