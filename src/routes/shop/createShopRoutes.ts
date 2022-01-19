import express, { Request, Response } from "express";
import { body } from "express-validator";
import "express-async-errors";

import { validateResult } from "../../middleware/validation-result";
import { BadRequestError } from "../../errors/bad-request-error";
import { currentUser, requireAdminSystemAuth } from "../../middleware";

import { Shop } from "../../controllers/shopController/shops";

const router = express.Router();
const shop = new Shop();

router.post(
  "/shops/create",
  currentUser,
  requireAdminSystemAuth,
  [
    body("shopIdentifier")
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .withMessage("Le code identifiant du shop est requis"),
    body("name")
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .withMessage("Le nom du shop est requis"),
    body("openDate")
      .isDate()
      .not()
      .isEmpty()
      .withMessage("La date d'ouverture du shop est requise"),
    body("description").optional().isLength({ min: 8 }),
    body("location")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("L'emplacement du shop est requis"),
  ],
  validateResult,
  async (req: Request, res: Response) => {
    const existingShop = await shop.findOneShop(req.body.shopIdentifier);
    if (existingShop) {
      throw new BadRequestError("Identifiants du shop invalides");
    }
    const newShop = await shop.createShop(
      req.body.shopIdentifier,
      req.body.name,
      new Date(req.body.openDate),
      req.body.description,
      req.body.location
    );
    res.status(201).send({
      message: `Shop créé avec succès par ${req.currentUser?.firstName} - ${req.currentUser?.role}`,
      data: newShop,
    });
  }
);

export { router as createShopRoutes };
// {
//   "shopIdentifier": "SHOP-LPM-002",
//   "name": "SIFA",
//   "openDate": "2021/01/09",
//   "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
//   "location": "Avenue du Musee 31bis Himbi"
// }
