import { Router, Request, Response } from "express";
import { getTodosController } from "../controllers/getTodoController";
import verifyToken from "../middlewares/verifyToken";

const getTodoRouter = Router();

getTodoRouter.get("/", verifyToken, getTodosController);

export default getTodoRouter;
