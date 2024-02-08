import { Router } from "express";
import  getDeleteTodosController  from "../controllers/getDeleteTodosController";
import verifyToken from "../middlewares/verifyToken";

const getDeletedTodosRouter = Router();

// Kullanıcıya özel silinen todo'ları getir
getDeletedTodosRouter.get("/", verifyToken, getDeleteTodosController);

export default getDeletedTodosRouter;
