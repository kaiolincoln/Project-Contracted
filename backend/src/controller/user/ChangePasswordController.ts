import { Request, Response } from "express";
import { ChangePasswordService } from "../../services/User/ChangePasswordService";

class ChangePasswordController {
  async handle(req: Request, res: Response) {
    const { currentPassword, newPassword } = req.body;
    const user_id = req.user_id;

    const changePasswordService = new ChangePasswordService();

    await changePasswordService.execute({
      user_id: user_id as string,
      currentPassword,
      newPassword,
    });

    res.json({ message: "Senha alterada com sucesso" });
  }
}

export { ChangePasswordController };