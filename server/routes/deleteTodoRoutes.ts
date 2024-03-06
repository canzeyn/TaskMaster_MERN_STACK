import { Router, Request, Response } from "express";
import deleteTodoController from "../controllers/deleteTodoController";
import verifyToken from "../middlewares/verifyToken";

const deleteTodoRouter = Router();

deleteTodoRouter.delete("/:id", verifyToken ,  deleteTodoController); // : ile bir parametre yani url parametresi geleceğini belirtiyoruz urlden söyşlenen sunucya atılan istekteki değişken kısım
 
export default deleteTodoRouter;
