import { Request, Response } from "express";
import { DeleteUserService } from "../../services/User/DeleteUserService";

class DeleteUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const requester_id = req.user_id;

    const deleteUserService = new DeleteUserService();

    await deleteUserService.execute({
      user_id: id  as string,
      requester_id: requester_id as string,
    });

    res.json({ message: "Usuário removido com sucesso" });
  }
}

export { DeleteUserController };