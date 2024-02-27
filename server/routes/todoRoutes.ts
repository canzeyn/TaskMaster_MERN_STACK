import { Router, Request, Response } from "express";
import todoController from "../controllers/todoController"
import verifyToken from "../middlewares/verifyToken";

const todoRouter = Router();

todoRouter.post("/", verifyToken ,  todoController);

export default todoRouter;
