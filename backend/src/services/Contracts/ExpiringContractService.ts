import prismaClient from "../../prisma/index";

class ExpiringContractService {
  async execute() {

    const today = new Date();

    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);

    const contracts = await prismaClient.contract.findMany({
      where: {
        status: "ACTIVE",
        endDate: {
          gte: today,      
          lte: in30Days,   
        }
      },
      orderBy: { endDate: "asc" }, 
      select: {
        id: true,
        title: true,
        number: true,
        value: true,
        status: true,
        endDate: true,
        client: {
          select: { id: true, name: true }
        },
        responsible: {
          select: { id: true, name: true }
        }
      }
    });

    const contractsWithDaysLeft = contracts.map((contract) => {
      const daysLeft = Math.ceil(
        (contract.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...contract,
        daysLeft,
      };
    });

    return contractsWithDaysLeft;
  }
}

export { ExpiringContractService };