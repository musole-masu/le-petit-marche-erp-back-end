import express, { Request, Response } from "express";
import { body } from "express-validator";
import "express-async-errors";
import * as dotenv from "dotenv";
import { Password } from "../../../utils/passwordHashingUtil";

import { validateResult } from "../../../middleware/validation-result";
import { BadRequestError } from "../../../errors/bad-request-error";
import { currentUser, requireAdminSystemAuth } from "../../../middleware";

import { User } from "../../../controllers/userController/users";

const router = express.Router();
const user = new User();

router.post(
  "/admin/le-petit-marche/create-user",
  currentUser,
  requireAdminSystemAuth,
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
    body("role")
      .not()
      .isEmpty()
      .withMessage("Le rôle de l'utilisateur est requis"),
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
      req.body.role,
      req.body.shopIdentifier
    );

    res.status(201).send({
      message: `Utilisateur créé avec succès par ${req.currentUser?.firstName} - ${req.currentUser?.role}`,
      data: newUser,
    });
  }
);

export { router as createUserRoutes };

// {
//   "userIdentifier": "LPM-SOUS-GERANT-001",
//   "firstName": "MOISE",
//   "lastName": "BAHU",
//   "email": "moise@bahu.com",
//   "password": "12345",
//   "dateOfBirth": "1997/04/01",
//   "hireDate": "2021/08/11",
//   "idCardNumber": "0PGDK6",
//   "role": "SOUS_GERANT"
// }

// {
//   "userIdentifier": "LPM-FINANCIER-001",
//   "firstName": "SIFA",
//   "lastName": "MIRINDI",
//   "email": "sifa@mirindi.com",
//   "password": "12345",
//   "dateOfBirth": "1989/04/01",
//   "hireDate": "2021/08/11",
//   "idCardNumber": "0PGDK6",
//   "role": "FINANCIER"
// }
