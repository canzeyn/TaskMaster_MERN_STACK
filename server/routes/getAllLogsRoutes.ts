import { Router, Request, Response } from "express";
import getAllLogs from "../controllers/getAllLogsController"
 const getAllLogsRouter = Router();

 getAllLogsRouter.get("/" , getAllLogs);

 export default getAllLogsRouter;
