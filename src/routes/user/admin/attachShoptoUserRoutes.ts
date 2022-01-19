import express, { Request, Response } from "express";
import { body } from "express-validator";
import "express-async-errors";
import * as dotenv from "dotenv";
import { JsonWebTokenUtil } from "../../../utils/jwtUtil";
import { Password } from "../../../utils/passwordHashingUtil";

import { validateResult } from "../../../middleware/validation-result";
import { BadRequestError } from "../../../errors/bad-request-error";
import { currentUser, requireAdminSystemAuth } from "../../../middleware";

import { User } from "../../../controllers/userController/users";

const router = express.Router();
const user = new User();

router.post(
  "/admin/le-petit-marche/user/attach-shop",
  currentUser,
  requireAdminSystemAuth,
  [
    body("userIdentifier")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("L'identifiant de l'utilisateur est requis"),
    body("shopIdentifier")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("L'identifiant du shop est requis"),
  ],
  validateResult,
  async (req: Request, res: Response) => {
    const { userIdentifier, shopIdentifier } = req.body;
    const result = await user.attachShoptoUser(userIdentifier, shopIdentifier);

    res.status(200).send({
      message: `Shop ${result.shopIdentifier} associé a ${result.firstName} ${result.lastName} avec succès par ${req.currentUser?.firstName} - ${req.currentUser?.role}`,
      data: result,
    });
  }
);

export { router as attachShoptoUserRoutes };

// {
//   "userIdentifier": "LPM-SOUS-GERANT-001",
//   "shopIdentifier": "SHOP-LPM-001"
// }
