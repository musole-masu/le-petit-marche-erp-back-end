import express, { Request, Response } from "express";

import { currentUser, requireAdminAuth } from "../../middleware";

import { Shop } from "../../controllers/shopController/shops";

const router = express.Router();
const shop = new Shop();

router.get(
  "/shops",
  currentUser,
  requireAdminAuth,
  async (req: Request, res: Response) => {
    const withUsers = Boolean(req.query.withUsers);
    const shops = await shop.findShops(withUsers);
    res.status(200).send({
      message: `Liste des shops par ${req.currentUser?.firstName} - ${req.currentUser?.role}`,
      data: shops,
    });
  }
);

export { router as getShopsRouter };
