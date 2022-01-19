import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = req.currentUser?.role;
  if (role !== "ADMIN_SYSTEM" && "GERANT" && "FINANCIER") {
    throw new NotAuthorizedError();
  }
  next();
};
