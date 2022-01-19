import express, { Request, Response } from "express";
import { Book } from "../../../controllers/accounting/books";
import { currentUser, requireAdminAuth } from "../../../middleware";

const books = new Book();
const router = express.Router();

router.get(
  "/books/ledger/:bookAccountNumber",
  currentUser,
  requireAdminAuth,
  async (req: Request, res: Response) => {
    const result = await books.getLedger(req.params.bookAccountNumber);
    res.status(200).send({ data: result });
  }
);

export { router as getBookLedgerRoutes };
