import express, { Request, Response } from "express";
import { Book } from "../../../controllers/accounting/books";
import { BadRequestError } from "../../../errors/bad-request-error";
import { currentUser, requireAdminAuth } from "../../../middleware";

const books = new Book();
const router = express.Router();

router.post(
  "/books/new",
  currentUser,
  requireAdminAuth,
  async (req: Request, res: Response) => {
    const withTransactions = Boolean(req.query.withTransactions);
    const existingBook = await books.getBookWithTransactions(
      req.body.bookAccountNumber,
      withTransactions
    );
    if (existingBook) {
      throw new BadRequestError("Désolé ce journal existe déjà");
    }
    const book = await books.saveOneBook(
      req.body.name,
      req.body.bookAccountNumber,
      req.body.quotedCurrency,
      req.body.shopIdentifier
    );

    res.status(201).send({
      message: `Journal créé avec succès par ${req.currentUser?.firstName} - ${req.currentUser?.role}`,
      data: book,
    });
  }
);

export { router as addBookRoutes };

// {
//   "name": "JOURNAL DE CAISSE - CAISSE RECETTE USD - SHOP-LPM-001",
//   "bookAccountNumber": "5722027001-SHOP-LPM-001",
//   "quotedCurrency": "USD",
//   "shopIdentifier": "SHOP-LPM-001"
// }

// {
//   "name": "JOURNAL - CLIENTS USD - SHOP-LPM-001",
//   "bookAccountNumber": "41111-SHOP-LPM-001",
//   "quotedCurrency": "USD",
//   "shopIdentifier": "SHOP-LPM-001"
// }
