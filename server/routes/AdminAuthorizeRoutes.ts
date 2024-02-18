import express , { Router , Request , Response } from 'express';
import  authorize  from '../middlewares/authorizeMiddleware';

const adminRouter = express.Router();

adminRouter.get('/', authorize(["admin"]), (req: Request, res: Response) => { //authorize fonksiyonu başka bir middlewareden alınıyor
  //bu middleware içine admin değeri gönderiliyor parametre olarak o middleware içinde eğer admin değeri varsa tokende bu rotaya ulaşabiliyor eğer değilse ulaşamaıyor
    res.send("Admin içeriği.");
  });