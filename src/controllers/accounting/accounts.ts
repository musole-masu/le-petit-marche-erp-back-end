import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

export class Accounts {
  saveOneAccount = async (
    accountName: string,
    accountNumber: string,
    accountingClass: string,
    description: string | ""
  ) => {
    const account = await prisma.accounts.create({
      data: {
        accountName: accountName,
        accountNumber: accountNumber,
        accountingClass: accountingClass,
        description: description,
      },
    });
    return account;
  };
  saveManyAccounts = async (
    accountName: string,
    accountNumber: string,
    accountingClass: string,
    description: string | ""
  ) => {
    const accounts = await prisma.accounts.createMany({
      data: {
        accountName: accountName,
        accountNumber: accountNumber,
        accountingClass: accountingClass,
        description: description,
      },
    });
  };
  fetchAccounts = async (withTransactions: boolean = false) => {
    const accounts = await prisma.accounts.findMany({
      include: {
        transactions: withTransactions,
      },
    });
    return accounts;
  };
  fetchAccount = async (
    accountNumber: string,
    withTransactions: boolean = false
  ) => {
    const account = await prisma.accounts.findUnique({
      where: {
        accountNumber: accountNumber,
      },
      include: {
        transactions: withTransactions,
      },
    });
    return account;
  };
}
