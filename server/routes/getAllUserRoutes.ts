import express from "express";
import { Router } from "express";
import allUser from "../controllers/getAllUserController";

const allUserRouter = Router();

allUserRouter.get("/", allUser);

export default allUserRouter;
