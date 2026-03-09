import { Request, Response } from "express";
import { DeleteContractService } from "../../services/Contracts/DeleteContractService";

class DeleteContractController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const user_id = req.user_id;

    const deleteContractService = new DeleteContractService();

    await deleteContractService.execute({
      contract_id: id as string,
      user_id: user_id as string,
    });

    res.json({ message: "Contrato removido com sucesso" });
  }
}

export { DeleteContractController };