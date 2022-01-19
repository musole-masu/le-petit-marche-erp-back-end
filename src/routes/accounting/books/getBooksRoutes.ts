import express, { Request, Response } from "express";
import { Book } from "../../../controllers/accounting/books";
import { currentUser, requireAdminAuth } from "../../../middleware";

const router = express.Router();
const books = new Book();

router.get(
  "/books",
  currentUser,
  requireAdminAuth,
  async (req: Request, res: Response) => {
    const result = await books.getBooks();
    res.status(200).send({ message: "Journaux de caisses", data: result });
  }
);

export { router as getBooksRoutes };
