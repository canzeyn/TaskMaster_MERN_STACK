import express , { Router , Request , Response } from 'express';
import { authorize } from '../middlewares/authorizeMiddleware';

const router = express.Router();

router.get('/', authorize(["admin"]), (req: Request, res: Response) => { //authorize fonksiyonu başka bir middlewareden alınıyor
    res.send("Admin içeriği.");
  });