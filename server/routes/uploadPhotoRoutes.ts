import { Router, Request, Response } from "express";
import multer from 'multer';
import uploadFile from "../controllers/uploadPhotoController"


const uploadRouter = Router();

 const upload = multer({ dest: 'uploads/' }); // yüklenen dosyalar cloudinarye gönderilmeden önce geçici olarak uploads adlı klasörde tutulur

 uploadRouter.post('/', upload.single('file'), uploadFile); // bu rotaya yapılan post isteklerini işleyecek bunu işlemesi için uploadFile adlı sayfayı kullanacak
 // upload.single(file) burada her seferde yalnızca 1 dosya ekelneceğini belirtiyor

 export default uploadRouter;