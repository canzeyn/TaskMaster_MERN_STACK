import { Router, Request, Response } from "express";

const logOutRouter = Router();

 logOutRouter.get('/' , function(req: Request , res: Response) {
    res.clearCookie('token'); // Cookie'yi temizle
    res.status(200).json({ message: 'Çıkış yapıldı.' }); // Başarı mesajı gönder
 })

 export default logOutRouter;