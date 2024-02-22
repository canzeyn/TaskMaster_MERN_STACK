import { Router, Request, Response } from "express";
import getAllTodoController from "../controllers/getAllTodosController";

const getAllTodosRouter = Router();

getAllTodosRouter.get("/", getAllTodoController);

export default getAllTodosRouter;
