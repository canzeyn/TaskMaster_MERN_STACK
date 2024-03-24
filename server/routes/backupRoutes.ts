import { Request, Response, Router } from "express";
import backupController from "../controllers/backupController";

const backupRouter = Router();

backupRouter.post("/:backupName", backupController);

export default backupRouter;
