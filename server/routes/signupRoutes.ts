import express , { Router , Request , Response } from 'express';
import { userController } from "../controllers/userController"

const router = express.Router();

router.post('/', userController); //veri göndermek için post isteği atılır mesela burada client taraftan express suncumuza veri gönderiyoruz post isteği ile clienttan sunucuya veri gönderilir

export default router;




