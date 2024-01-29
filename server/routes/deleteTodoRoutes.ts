import { Router, Request, Response } from "express";
import deleteTodoController from "../controllers/deleteTodoController";

const deleteTodoRouter = Router();

deleteTodoRouter.delete("/:id", deleteTodoController); // : ile bir parametre yani url parametresi geleceğini belirtiyoruz urlden söyşlenen sunucya atılan istekteki değişken kısım
 
export default deleteTodoRouter;
