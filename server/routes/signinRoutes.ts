import express , { Router , Request , Response } from 'express';
import { signinController } from '../controllers/signinController';

const signinRoutes = express.Router();

signinRoutes.post("/" , signinController);

export default signinRoutes;
