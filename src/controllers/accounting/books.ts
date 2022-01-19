import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

export class Book {
  saveOneBook = async (
    name: string,
    bookAccountNumber: string,
    quotedCurrency: string = "USD",
    shopIdentifier: string
  ) => {
    const book = await prisma.book.create({
      data: {
        name: name,
        bookAccountNumber: bookAccountNumber,
        quotedCurrency: quotedCurrency,
        shopIdentifier: shopIdentifier,
      },
    });

    return book;
  };
  getBookWithTransactions = async (
    bookAccountNumber: string,
    withTransactions: boolean = false
  ) => {
    const bookTransactions = await prisma.book.findUnique({
      where: {
        bookAccountNumber: bookAccountNumber,
      },
      include: {
        transactions: withTransactions,
      },
    });

    return bookTransactions;
  };
  getBooks = async () => {
    const books = await prisma.book.findMany({});
    return books;
  };
  getBookAccountBalance = async (accountNumber: string) => {
    const accountTransactionBalance = await prisma.transaction.aggregate({
      _sum: {
        debit: true,
        credit: true,
      },
      _count: {
        accountNumber: true,
      },
      where: {
        accountNumber: accountNumber,
      },
    });

    const debitTotal: number = Number(accountTransactionBalance._sum.debit);
    const creditTotal: number = Number(accountTransactionBalance._sum.credit);
    const numberOfTransaction = accountTransactionBalance._count.accountNumber;
    const balance: number = debitTotal - creditTotal;

    return {
      debitTotal,
      creditTotal,
      numberOfTransaction,
      balance,
    };
  };

  getLedger = async (bookAccountNumber: string) => {
    const bookLegder = await prisma.journalEntry.findMany({
      where: {
        bookAccountNumber: bookAccountNumber,
      },
      include: {
        transactions: true,
      },
    });
    return bookLegder;
  };
}
