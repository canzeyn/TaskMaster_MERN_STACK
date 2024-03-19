import { Request, Response, Router } from "express";
import backupController from "../controllers/backupController";

const backupRouter = Router();

backupRouter.get("/:backupName", backupController);

export default backupRouter;
