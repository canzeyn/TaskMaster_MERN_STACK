import express , { Router , Request , Response } from 'express';
import { userController } from "../controllers/userController"

const signupRouter = express.Router();

signupRouter.post('/', userController); //veri göndermek için post isteği atılır mesela burada client taraftan express suncumuza veri gönderiyoruz post isteği ile clienttan sunucuya veri gönderilir

export default signupRouter;




