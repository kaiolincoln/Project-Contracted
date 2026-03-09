import { Request, Response } from "express";
import { UpdateUserService } from "../../services/User/UpdateUserService";

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { name, email } = req.body;
    const user_id = req.user_id;

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      user_id: user_id as string,
      name,
      email,
    });

    res.json({ message: user });
  }
}

export { UpdateUserController };



