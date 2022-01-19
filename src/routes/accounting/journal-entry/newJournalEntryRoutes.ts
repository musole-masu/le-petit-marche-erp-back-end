import express, { Request, Response } from "express";
import { Journal } from "../../../controllers/accounting/journals";
import { Prisma, PrismaClient } from ".prisma/client";

import { currentUser, requireFinanceAuth } from "../../../middleware";
const router = express.Router();
const prisma = new PrismaClient();
const journalEntry = new Journal();

router.post(
  "/journal-entry/new",
  currentUser,
  requireFinanceAuth,
  async (req: Request, res: Response) => {
    const transactions = <Prisma.TransactionCreateManyJournalEntryInput>(
      req.body.transactions
    );

    const result = await journalEntry.saveJournalEntryWithTxs(
      req.body.description,
      transactions,
      req.body.bookAccountNumber,
      false,
      ""
    );

    res.status(201).send({
      message: `Entrée du journal enregistrée avec succès par ${req.currentUser?.firstName} - ${req.currentUser?.role}`,
      data: result,
    });
  }
);

export { router as newJournalEntryRoutes };

// JOURNAL CLIENT SHOP-LPM-001
// {
//   "description": "FACTURATION - CLIENT SHOP-LPM-001 -VENTE DE POULET DE CHAIR ",
//   "transactions": [
//     {"debit": 2044.00, "credit": 0.00, "accountNumber": "41111-SHOP-LPM-001", "bookAccountNumber": "41111-SHOP-LPM-001", "shopIdentifier": "SHOP-LPM-001"},
//     {"debit": 0.00, "credit": 150.00, "accountNumber": "7011-POULET-DE-CHAIR", "bookAccountNumber": "41111-SHOP-LPM-001", "shopIdentifier": "SHOP-LPM-001"},
//     {"debit": 0.00, "credit": 1805.00, "accountNumber": "7011-POULET-DE-CHAIR", "bookAccountNumber": "41111-SHOP-LPM-001", "shopIdentifier": "SHOP-LPM-001"},
//     {"debit": 0.00, "credit": 85.00, "accountNumber": "7011-POULET-DE-CHAIR", "bookAccountNumber": "41111-SHOP-LPM-001", "shopIdentifier": "SHOP-LPM-001"}
//   ],
//   "bookAccountNumber": "41111-SHOP-LPM-001"
// }

// JOURNAL CAISSE RECETTE USD SHOP-LPM-001
// {
//   "description": "REGLEMENT - FACTURE - CLIENT SHOP-LPM-001 -VENTE DE POULET DE CHAIR",
//   "transactions": [
//     {"debit": 2040.00, "credit": 0.00, "accountNumber": "5722027001-SHOP-LPM-001", "bookAccountNumber": "5722027001-SHOP-LPM-001", "shopIdentifier": "SHOP-LPM-001"},
//     {"debit": 0.00, "credit": 2049.00, "accountNumber": "41111-SHOP-LPM-001", "bookAccountNumber": "5722027001-SHOP-LPM-001", "shopIdentifier": "SHOP-LPM-001"},
//   ],
//   "bookAccountNumber": "5722027001-SHOP-LPM-001"
// }
