import express, { Request, Response } from "express";
import "express-async-errors";
import * as dotenv from "dotenv";
import { BadRequestError } from "../../../errors/bad-request-error";
import { currentUser, requireAdminSystemAuth } from "../../../middleware";

import { User } from "../../../controllers/userController/users";

const router = express.Router();
const user = new User();

router.get(
  "/admin/le-petit-marche/users",
  currentUser,
  requireAdminSystemAuth,
  async (req: Request, res: Response) => {
    const result = await user.findUsers();
    res.status(200).send({
      message: `La liste des utilisateurs par ${req.currentUser?.firstName} - ${req.currentUser?.role}`,
      data: result,
    });
  }
);

export { router as getUsersRoutes };
