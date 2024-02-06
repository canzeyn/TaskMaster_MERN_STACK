import { Router, Request, Response } from "express";
import multer from 'multer';
import uploadPhotoController from "../controllers/uploadPhotoController";
import verifyToken from "../middlewares/verifyToken";


const uploadRouter = Router();

 const upload = multer({ dest: 'uploads/' }); // yüklenen dosyalar cloudinarye gönderilmeden önce geçici olarak uploads adlı klasörde tutulur

 uploadRouter.post('/', verifyToken,  upload.single('file'), uploadPhotoController); // bu rotaya yapılan post isteklerini işleyecek bunu işlemesi için uploadFile adlı sayfayı kullanacak
 // upload.single(file) burada her seferde yalnızca 1 dosya ekelneceğini belirtiyor

 export default uploadRouter;