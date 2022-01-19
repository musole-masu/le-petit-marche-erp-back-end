import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const requireFinanceAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = req.currentUser?.role;
  if (role !== "ADMIN_SYSTEM" && "GERANT" && "FINANCIER" && "SOUS_GERANT") {
    throw new NotAuthorizedError();
  }
  next();
};
