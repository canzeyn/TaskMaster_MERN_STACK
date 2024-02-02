// controllers/uploadController.ts
import { Request, Response } from 'express';
import cloudinaryV2 from '../config/cloudinaryConfig';
import multer from 'multer';


// interface MulterRequest extends Request { // burada expressin normal request nesnesine belirlediğimiz interface özelliğinide ekler 
//     file: Express.Multer.File; // multer paketinin dosya özelliğini ekliyoruz yani yüklenen dosyanın bilgilerini içeriyor
// }

 const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File;  // istek nesnesinden dosya alınıyor
    if (!file) { // dosya yoksa kodlar çalışır
      return res.status(400).send('Dosya yüklenmedi.');
    }

    const result = await cloudinaryV2.uploader.upload(file.path); // bu kısım cloudinarye dosya yüklemek için kullanılır yploader.upload yükleme işlmeini gerçekleştirir
    // file.path nesnesi multer tarafandın işlenen dosyadır path ise sunucudaki geçici yerdir eklenecek dosyanın
    // upload işlemi asenkrondur ve uzun sürebilir bunun için await ile bekletiliyor
    // son olarak yüklenen dosyanın tüm bilgisi nesne olarak result değişkenine atılıyor 

    res.status(200).json({ url: result.secure_url }); 
  } catch (error) {
    res.status(500).send(`Dosya yükleme hatası: ${error}`);
  }
};

   export default uploadFile;
