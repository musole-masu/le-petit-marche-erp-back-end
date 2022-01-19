import express, { Request, Response } from "express";
import "express-async-errors";
import * as dotenv from "dotenv";
import { BadRequestError } from "../../../errors/bad-request-error";
import { currentUser, requireAdminSystemAuth } from "../../../middleware";

import { User } from "../../../controllers/userController/users";

const router = express.Router();
const user = new User();

router.get(
  "/admin/le-petit-marche/users/:userIdentifier",
  currentUser,
  requireAdminSystemAuth,
  async (req: Request, res: Response) => {
    const result = await user.findUserByUserIdentifier(
      req.params.userIdentifier
    );
    res.status(200).send({
      message: `Les informations de l'utilisateur ${result?.firstName} ${result?.lastName} ont été obtenues avec succès par ${req.currentUser?.firstName} - ${req.currentUser?.role}`,
      data: result,
    });
  }
);

export { router as getUserRoutes };
