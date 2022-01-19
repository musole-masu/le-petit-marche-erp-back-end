import express from "express";
import { IUserPayload } from "../../interfaces/userPayload";

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUserPayload;
    }
  }
}
