import { Router, Request, Response } from "express";
import verifyToken from "../middlewares/verifyToken";
import getUser from "../middlewares/getUser";

const todoRouter = Router();

todoRouter.get("/",   (req: Request, res: Response) => {
  const user = (req as any).user;
  // res.json({ message: "burada todo verileri olacak", user: user });
  // console.log("todo rotasına get isteği atıldı, kullanıcı: ", user.email);
});

export default todoRouter;
