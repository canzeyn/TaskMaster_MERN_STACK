import express, { Router } from "express";
import getMonthlyTodoReport from "../controllers/getMonthlyTodoReportController";
import verifyToken from "../middlewares/verifyToken";

const getMonthlyTodoReportRouter = Router();

getMonthlyTodoReportRouter.get("/", verifyToken, getMonthlyTodoReport);

export default getMonthlyTodoReportRouter;
