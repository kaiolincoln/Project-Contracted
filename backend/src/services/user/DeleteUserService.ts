import prismaClient from "../../prisma/index";

interface DeleteUserRequest {
  user_id: string;
  requester_id: string;
}

class DeleteUserService {
  async execute({ user_id, requester_id }: DeleteUserRequest) {

    const user = await prismaClient.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user_id === requester_id) {
      throw new Error("Você não pode deletar sua própria conta por essa rota");
    }

    await prismaClient.user.delete({
      where: { id: user_id }
    });
  }
}

export { DeleteUserService };