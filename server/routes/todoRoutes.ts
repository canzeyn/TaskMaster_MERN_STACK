import { Router, Request, Response } from "express";
import todoController from "../controllers/todoController"

const todoRouter = Router();

todoRouter.post("/", todoController);

export default todoRouter;
