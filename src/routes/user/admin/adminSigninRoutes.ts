import express, { Request, Response } from "express";
import { body } from "express-validator";
import "express-async-errors";
import { PrismaClient } from ".prisma/client";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Password } from "../../../utils/passwordHashingUtil";
import { JsonWebTokenUtil } from "../../../utils/jwtUtil";

import { validateResult } from "../../../middleware/validation-result";
import { BadRequestError } from "../../../errors/bad-request-error";

import { User } from "../../../controllers/userController/users";

const router = express.Router();
const prisma = new PrismaClient();
const user = new User();

router.post(
  "/admin/le-petit-marche/signin",
  [
    body("email").not().isEmpty().isEmail().withMessage("L'e-mail est requis"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Le mot de passe est requis"),
  ],
  validateResult,
  async (req: Request, res: Response) => {
    const { email, password: plainPassword } = req.body;

    const existingUser = await user.findOneUser(email);
    if (!existingUser) {
      throw new BadRequestError("Identifiants invalides");
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      plainPassword
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const userPayload = {
      id: existingUser.id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      role: existingUser.role,
    };

    // GENERATE WEB TOKEN
    const userJwt = JsonWebTokenUtil.signJwt(userPayload);

    // STORE IN SESSION OBJECT
    req.session!.jwt = userJwt;

    res.status(200).json({
      message: "Utilisateur connecté avec succès",
      data: existingUser,
    });
  }
);

export { router as adminSigninRoutes };
