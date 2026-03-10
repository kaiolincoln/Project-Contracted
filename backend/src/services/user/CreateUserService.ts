import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: CreateUserProps) {

    const userAlreadyExists = await prismaClient.user.findFirst({
      where: { email }
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já cadastrado");
    }

    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: "EDITOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return user; 
  }
}

export { CreateUserService };