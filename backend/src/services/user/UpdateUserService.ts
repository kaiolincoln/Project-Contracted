import prismaClient from "../../prisma/index";

interface UpdateUserRequest {
  user_id: string;
  name?: string;
  email?: string;
}

class UpdateUserService {
  async execute({ user_id, name, email }: UpdateUserRequest) {

    const userExists = await prismaClient.user.findUnique({
      where: { id: user_id }
    });

    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    if (email && email !== userExists.email) {
      const emailInUse = await prismaClient.user.findUnique({
        where: { email }
      });

      if (emailInUse) {
        throw new Error("Este email já está em uso");
      }
    }

    const user = await prismaClient.user.update({
      where: { id: user_id },
      data: {
        name: name ?? userExists.name,
        email: email ?? userExists.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      }
    });

    return user;
  }
}

export { UpdateUserService };