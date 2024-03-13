import { Router, Request, Response } from "express";
import todoController from "../controllers/todoController"
import verifyToken from "../middlewares/verifyToken";
import apiLimiter from "../middlewares/apiLimiter";


const todoRouter = Router();

todoRouter.post("/", verifyToken , apiLimiter , todoController);

export default todoRouter;
