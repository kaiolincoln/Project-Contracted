import prismaClient from "../../prisma/index";

interface UpdateStatusContractRequest {
  contract_id: string;
  user_id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING_RENEWAL";
}

class UpdateStatusContractService {
  async execute({ contract_id, user_id, status }: UpdateStatusContractRequest) {

    const contract = await prismaClient.contract.findUnique({
      where: { id: contract_id }
    });

    if (!contract) {
      throw new Error("Contrato não encontrado");
    }

    if (contract.status === "CANCELLED") {
      throw new Error("Não é possível alterar o status de um contrato cancelado");
    }

    const updatedContract = await prismaClient.contract.update({
      where: { id: contract_id },
      data: { status },
      select: {
        id: true,
        title: true,
        number: true,
        status: true,
        updatedAt: true,
      }
    });

    await prismaClient.contractHistory.create({
      data: {
        action: "STATUS_CHANGED",
        detail: `Status alterado de ${contract.status} para ${status}`,
        contractId: contract_id,
        userId: user_id,
      }
    });

    return updatedContract;
  }
}

export { UpdateStatusContractService };