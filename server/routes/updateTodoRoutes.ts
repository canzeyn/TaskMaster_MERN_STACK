import { Router, Request, Response } from "express";
import updateTodoController from "../controllers/updateTodoController";

const updateTodoRouter = Router();

updateTodoRouter.put("/:id", updateTodoController);

export default updateTodoRouter;
