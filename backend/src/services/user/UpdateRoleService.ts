import prismaClient from "../../prisma/index";


interface UpdateRoleRequest {
  user_id: string;
  role: "ADMIN" | "EDITOR";
}

class UpdateRoleService {
  async execute({ user_id, role }: UpdateRoleRequest) {

    const user = await prismaClient.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: user_id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      }
    });

    return updatedUser;
  }
}

export { UpdateRoleService };