import { Prisma, PrismaClient } from ".prisma/client";
import { JournalEntryBalanceError } from "../../errors/journalEntry-balance-error";

const prisma = new PrismaClient();

export class Journal {
  public pendingTransactions: any;

  saveJournalEntryWithTxs = async (
    description: string,
    transactions: Prisma.TransactionCreateManyJournalEntryInput,
    bookAccountNumber: string,
    voided: boolean,
    voidedReason: string
  ) => {
    this.pendingTransactions = transactions;

    const transactionTotal = this.calculatingTransactionsTotal(
      this.pendingTransactions
    );

    if (transactionTotal !== 0) {
      throw new JournalEntryBalanceError();
    }
    const journalEntry = await prisma.journalEntry.create({
      data: {
        description,
        bookAccountNumber,
        voided,
        voidedReason,
        transactions: {
          createMany: {
            data: transactions,
          },
        },
      },
    });

    return journalEntry;
  };

  calculatingTransactionsTotal(
    transactions: Array<Prisma.TransactionCreateWithoutJournalEntryInput>
  ) {
    if (transactions.length === 0) {
      return;
    }

    let total: number = 0.0;

    for (let tx of transactions) {
      total = total + Number(tx.credit);
      total = total - Number(tx.debit);
    }
    return Math.abs(total);
  }
}
