import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const requireAdminSystemAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.currentUser?.role !== "ADMIN_SYSTEM" && "GERANT") {
    throw new NotAuthorizedError();
  }
  next();
};
