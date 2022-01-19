import express, { Request, Response } from "express";
import { body } from "express-validator";
import "express-async-errors";
import { PrismaClient } from ".prisma/client";
import * as dotenv from "dotenv";
import { JsonWebTokenUtil } from "../../../utils/jwtUtil";
import { Password } from "../../../utils/passwordHashingUtil";

import { validateResult } from "../../../middleware/validation-result";
import { BadRequestError } from "../../../errors/bad-request-error";

import { User } from "../../../controllers/userController/users";

const router = express.Router();
const prisma = new PrismaClient();
const user = new User();

router.post(
  "/admin/le-petit-marche/signup",
  [
    body("firstName")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage("Le prénom est requis"),
    body("lastName")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage("Le nom de famille est requis"),
    body("email").not().isEmpty().isEmail().withMessage("L'e-mail est requis"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Le mot de passe est requis"),
    body("dateOfBirth").not().isEmpty().isDate(),
    body("hireDate").not().isEmpty().isDate(),
    body("idCardNumber")
      .not()
      .isEmpty()
      .withMessage("Le numéro de carte d'identité est requis"),
    body("role").optional(),
  ],
  validateResult,
  async (req: Request, res: Response) => {
    // hashing user password
    const plainPassword = req.body.password;
    const hashedPassword = await Password.toHash(plainPassword);

    const existingUser = await user.findOneUser(req.body.email);
    if (existingUser) {
      throw new BadRequestError("Identifiants invalides");
    }

    const newUser = await user.signupAdmin(
      req.body.userIdentifier,
      req.body.firstName,
      req.body.lastName,
      hashedPassword,
      new Date(req.body.dateOfBirth),
      new Date(req.body.hireDate),
      req.body.idCardNumber,
      req.body.email,
      "ADMIN_SYSTEM",
      req.body.shopIdentifier
    );

    const userPayload = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      role: newUser.role,
    };

    // GENERATE WEB TOKEN
    const userJwt = JsonWebTokenUtil.signJwt(userPayload);

    // STORE IN SESSION OBJECT
    req.session!.jwt = userJwt;

    res.status(201).send({
      message: "Utilisateur créé avec succès",
      data: newUser,
      jwt: userJwt,
    });
    console.log("\x1b[33m%s\x1b[0m", "Utilisateur créé avec succès");
  }
);

export { router as adminSignupRoutes };

// {
//   "userIdentifier": "LPM-ADMIN-SYSTEM-001",
//   "firstName": "test",
//   "lastName": "test",
//   "email": "test@test.com",
//   "password": "12345",
//   "dateOfBirth": "01/04/1997",
//   "hireDate": "02/02/2020",
//   "idCardNumber": "0PGDK6",
//   "role": "ADMIN_SYSTEM"
// }
