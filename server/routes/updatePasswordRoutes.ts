import express , { Router , Request , Response } from 'express';
import verifyToken from '../middlewares/verifyToken';
import updatePasswordController from '../controllers/updatePasswordController';

 const updatePasswordRouter = Router();

 updatePasswordRouter.post('/' , verifyToken ,  updatePasswordController ); // burada verifyToken kullanılarak bu middleware ile şifre doğrulama sırasında kullanıcının oturumu kontrol edilir bu sayede şifreyi başka bir kullanıcı değiştiremez

 export default updatePasswordRouter;