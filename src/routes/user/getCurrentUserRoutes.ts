import express, { Request, Response } from "express";
import { currentUser } from "../../middleware";

const router = express.Router();

router.get("/user/current-user", currentUser, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as getCurrentUserRoutes };
