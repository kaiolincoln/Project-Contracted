import prismaClient from "../../prisma/index";

class ListContractService {
  async execute() {

    const contracts = await prismaClient.contract.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        number: true,
        value: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        client: {
          select: { id: true, name: true, document: true }
        },
        responsible: {
          select: { id: true, name: true }
        }
      }
    });

    return contracts;
  }
}

export { ListContractService };