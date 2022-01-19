import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JsonWebTokenUtil } from "../utils/jwtUtil";

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    next();
  }
  try {
    const payload = JsonWebTokenUtil.verifyJwt(req.session?.jwt);
    req.currentUser = payload;
  } catch (error) {}
  next();
};
