import { Router , Request , Response } from 'express';

const router = Router();

router.get('/' , (req: Request , res: Response) => {
    res.json({message: 'burada todo verileri olacak'})
    console.log("todo rotasına get isteği atıldı")
});

export default router;