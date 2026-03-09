import prismaClient from "../../prisma/index";

interface DeleteContractRequest {
  contract_id: string;
  user_id: string;
}

class DeleteContractService {
  async execute({ contract_id, user_id }: DeleteContractRequest) {

    const contract = await prismaClient.contract.findUnique({
      where: { id: contract_id }
    });

    if (!contract) {
      throw new Error("Contrato não encontrado");
    }

    if (contract.status === "ACTIVE") {
      throw new Error("Não é possível deletar um contrato ativo. Cancele-o primeiro");
    }

    await prismaClient.contractHistory.create({
      data: {
        action: "CONTRACT_DELETED",
        detail: `Contrato ${contract.number} removido`,
        contractId: contract_id,
        userId: user_id,
      }
    });

    await prismaClient.contract.delete({
      where: { id: contract_id }
    });
  }
}

export { DeleteContractService };