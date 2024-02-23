import { Request, Response, Router } from "express";
import adminDeleteTodoController from "../controllers/adminDeleteTodoController";

const adminDeleteTodoRouter = Router();

adminDeleteTodoRouter.delete("/:id", adminDeleteTodoController);

export default adminDeleteTodoRouter;
