import express, { Request, Response } from "express";
import { body } from "express-validator";
import "express-async-errors";
import { PrismaClient } from ".prisma/client";

import { currentUser, requireAdminSystemAuth } from "../../middleware";
import { BadRequestError } from "../../errors/bad-request-error";
import { Shop } from "../../controllers/shopController/shops";

const shop = new Shop();

const router = express.Router();

router.put(
  "/shops/:shopIdentifier/update",
  currentUser,
  requireAdminSystemAuth,
  async (req: Request, res: Response) => {
    const updatedShop = await shop.updateOneShop(req.params.shopIdentifier, {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
    });
    res.status(200).send({
      message: `Shop mis à jour avec succès par ${req.currentUser?.firstName}-${req.currentUser?.role}`,
      data: updatedShop,
    });
  }
);

export { router as updateShopRoutes };

// {
//   "name": "ESHIMA",
//   "description": "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
//   "location": "Avenue du Musee 31 bis Himbi"
// }
