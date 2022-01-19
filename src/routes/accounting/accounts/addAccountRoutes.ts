import express, { Request, Response } from "express";
import { Accounts } from "../../../controllers/accounting/accounts";
import { BadRequestError } from "../../../errors/bad-request-error";

import { currentUser, requireAdminAuth } from "../../../middleware";
const accounts = new Accounts();
const router = express.Router();

router.post(
  "/account/new",
  currentUser,
  requireAdminAuth,
  async (req: Request, res: Response) => {
    const existingAccount = await accounts.fetchAccount(req.body.accountNumber);
    if (existingAccount) {
      throw new BadRequestError("Désolé ce compte existe déjà");
    }
    const result = await accounts.saveOneAccount(
      req.body.accountName,
      req.body.accountNumber,
      req.body.accountingClass,
      req.body.description || ""
    );
    res
      .status(201)
      .send({ message: "Compte créé avec succès", compte: result });
  }
);

router.post(
  "/accounts/new",
  currentUser,
  requireAdminAuth,
  async (req: Request, res: Response) => {
    const result = await accounts.saveManyAccounts(
      req.body.accountName,
      req.body.accountNumber,
      req.body.accountingClass,
      req.body.description || ""
    );
    res
      .status(201)
      .send({ message: "Comptes créés avec succès", compte: result });
  }
);

export { router as addAccountRoutes };

// {
//   "accountName": "CAISSE RECETTE USD - SHOP-LPM-001",
//   "accountNumber": "5722027001-SHOP-LPM-001",
//   "accountingClass": "5",
//   "description": "Caisse recette USD du Shop 001 LPM"
// }

// {
//   "accountName": "VENTE DE POULET DE CHAIR",
//   "accountNumber": "7011-POULET-DE-CHAIR",
//   "accountingClass": "7",
//   "description": "Compte de vente de poulet de chair"
// }

// {
//   "accountName": "CLIENTS - SHOP-LPM-001",
//   "accountNumber": "41111-SHOP-LPM-001",
//   "accountingClass": "4",
//   "description": "Compte des clients du SHOP-LPM-001"
// }
