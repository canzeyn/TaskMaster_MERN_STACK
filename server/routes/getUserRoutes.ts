import express , { Router , Request , Response } from 'express';
import verifyToken from '../middlewares/verifyToken';
import getUser from '../middlewares/getUser';

const getUserRouter = Router();

 getUserRouter.get('/' , verifyToken , getUser , (req: Request , res: Response) => {
    const user = (req as any).user;
    console.log("todo rotasına get isteği atıldı, kullanıcı: ", user.email);
    res.json({
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
    })
 })

 export default getUserRouter;