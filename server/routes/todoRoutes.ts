import { Router , Request , Response } from 'express';

const todoRouter = Router();

 todoRouter.get('/' , (req: Request , res: Response) => {
    res.json({message: 'burada todo verileri olacak'})
    console.log("todo rotasına get isteği atıldı")
});

export default todoRouter;