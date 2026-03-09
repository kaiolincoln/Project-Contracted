import { Request, Response } from "express";
import { UpdateRoleService } from "../../services/User/UpdateRoleService";

class UpdateRoleController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;

    const updateRoleService = new UpdateRoleService();

    const user = await updateRoleService.execute({
      user_id: id as string,
      role,
    });

    res.json(user);
  }
}

export { UpdateRoleController };