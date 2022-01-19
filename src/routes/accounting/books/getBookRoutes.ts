import express, { Request, Response } from "express";
import { Book } from "../../../controllers/accounting/books";
import { currentUser, requireAdminAuth } from "../../../middleware";

const books = new Book();
const router = express.Router();

router.get(
  "/books/:bookAccountNumber",
  currentUser,
  requireAdminAuth,
  async (req: Request, res: Response) => {
    const withTransactions = Boolean(req.query.withTransactions);
    const result = await books.getBookWithTransactions(
      req.params.bookAccountNumber,
      withTransactions
    );
    res
      .status(200)
      .send({ message: "Journal de caisse avec transactions", data: result });
  }
);

export { router as getBookRoutes };
