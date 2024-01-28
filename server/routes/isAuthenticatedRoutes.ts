import { Router, Request, Response } from "express";
import verifyToken from "../middlewares/verifyToken";

const isAuthencticatedRouter = Router();

isAuthencticatedRouter.get(
  "/",
  verifyToken,
  (req: Request, res: Response) => {
    res.send({ isAuthenticated: true });
  }
);

export default isAuthencticatedRouter;
