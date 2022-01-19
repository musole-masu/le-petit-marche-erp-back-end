import express from "express";
import cors from "cors";
import { PrismaClient } from ".prisma/client";
import cookieSession from "cookie-session";

import { errorHandler } from "./middleware";
import { adminSignupRoutes } from "./routes/user/admin/adminSignupRoutes";
import { adminSigninRoutes } from "./routes/user/admin/adminSigninRoutes";
import { getCurrentUserRoutes } from "./routes/user/getCurrentUserRoutes";
import { signoutRoutes } from "./routes/user/signoutRoutes";
import { createUserRoutes } from "./routes/user/admin/createUserRoutes";
import { getUserRoutes } from "./routes/user/admin/getUserRoutes";
import { getUsersRoutes } from "./routes/user/admin/getUsersRoutes";
import { createShopRoutes } from "./routes/shop/createShopRoutes";
import { getShopsRouter } from "./routes/shop/getShopsRoutes";
import { updateShopRoutes } from "./routes/shop/updateShopRoutes";
import { attachShoptoUserRoutes } from "./routes/user/admin/attachShoptoUserRoutes";
import { addAccountRoutes } from "./routes/accounting/accounts/addAccountRoutes";
import { getAccountRoutes } from "./routes/accounting/accounts/getAccountRoutes";
import { addBookRoutes } from "./routes/accounting/books/addBookRoutes";
import { getBookRoutes } from "./routes/accounting/books/getBookRoutes";
import { getBooksRoutes } from "./routes/accounting/books/getBooksRoutes";
import { getBookBalanceRoutes } from "./routes/accounting/books/getBookBalanceRoutes";
import { getBookLedgerRoutes } from "./routes/accounting/books/getBookLedgerRoutes";
import { newJournalEntryRoutes } from "./routes/accounting/journal-entry/newJournalEntryRoutes";

const app = express();
const PATH = "/api/v1";

app.use(cors());
app.use(express.json());
app.set("trust proxy", true); // trust first proxy

app.use(
  cookieSession({
    name: "session",
    signed: false,
    keys: ["key1", "key2"],
  })
);

const prisma = new PrismaClient();

const main = async () => {
  app.use(PATH, adminSignupRoutes);
  app.use(PATH, adminSigninRoutes);
  app.use(PATH, getCurrentUserRoutes);
  app.use(PATH, signoutRoutes);
  app.use(PATH, createUserRoutes);
  app.use(PATH, getUserRoutes);
  app.use(PATH, getUsersRoutes);
  app.use(PATH, createShopRoutes); // => /shops/new
  app.use(PATH, getShopsRouter);
  app.use(PATH, updateShopRoutes);
  app.use(PATH, attachShoptoUserRoutes);
  app.use(PATH, addAccountRoutes); // => /account/new & /accounts/new
  app.use(PATH, getAccountRoutes); // => /accounts
  app.use(PATH, newJournalEntryRoutes); // => /journal-entry/new
  app.use(PATH, addBookRoutes); // => /books/new
  app.use(PATH, getBookRoutes);
  app.use(PATH, getBooksRoutes); // => /books/:bookAccountNumber, /books/
  app.use(PATH, getBookBalanceRoutes);
  app.use(PATH, getBookLedgerRoutes);

  app.use(errorHandler);
};

export { main, prisma, app };
