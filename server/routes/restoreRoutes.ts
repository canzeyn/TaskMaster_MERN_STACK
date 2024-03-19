import { Request, Response, Router } from "express";
import restoreController from "../controllers/restoreController";

  const restoreRouter = Router();

  restoreRouter.get("/:restoreBackupName" , restoreController);

  export default restoreRouter;