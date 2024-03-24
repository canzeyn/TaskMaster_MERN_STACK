import { Request, Response, Router } from "express";
import restoreController from "../controllers/restoreController";
import verifyToken from "../middlewares/verifyToken";

  const restoreRouter = Router();

  restoreRouter.post("/:restoreBackupName" , verifyToken , restoreController);

  export default restoreRouter;