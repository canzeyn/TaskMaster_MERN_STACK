import { Router, Request, Response } from "express";
import valideSignUp from "../middlewares/signupValidete";

  const validatesRouter = Router();

  validatesRouter.get("/" , valideSignUp , (req:Request,res:Response) => {
    res.status(200).json({ message: "Kayıt başarılı!" });
  } );

  export default validatesRouter;