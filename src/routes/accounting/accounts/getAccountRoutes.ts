import express, { Request, Response } from "express";
import { Accounts } from "../../../controllers/accounting/accounts";
import { currentUser, requireAdminAuth } from "../../../middleware";

const accounts = new Accounts();
const router = express.Router();

router.get(
  "/accounts",
  currentUser,
  requireAdminAuth,
  async (req: Request, res: Response) => {
    const withTransactions = Boolean(req.query.withTransactions);
    const result = await accounts.fetchAccounts(withTransactions);
    res.send({ message: "La liste de comptes", data: result });
  }
);
router.get(
  "/accounts/:accountNumber",
  currentUser,
  requireAdminAuth,
  async (req: Request, res: Response) => {
    const withTransactions = Boolean(req.query.withTransactions);
    const result = await accounts.fetchAccount(
      req.params.accountNumber,
      withTransactions
    );
    res.send({
      message: `Numéro de compte ${result?.accountNumber} du (de le(a)) ${result?.accountName}`,
      data: result,
    });
  }
);

export { router as getAccountRoutes };
