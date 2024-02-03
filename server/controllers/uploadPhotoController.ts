// controllers/uploadController.ts
import { Request, Response } from 'express';
import cloudinaryV2 from '../config/cloudinaryConfig';
import User from '../models/userModel';


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
    
    const userId = (req as any).user.id;

    await User.findByIdAndUpdate(userId, { profilePictureUrl: result.secure_url }); // kullanıcının veri tabanındaki users adlı collection içinden bulunuyor id değeri ile ve o kullanıcının profilePictureUrl e güncelleme yapılarak eklediği fotoğrafın cloudinary adresi geliyor

    res.status(200).json({ url: result.secure_url }); // eklenen fotoğrafın cloudinarydeki güvenli adresi bulunuyor secure_url de bu adresi mongodb içine ekleyeceğiz ve bu adres üzerinden cloudinaryden kullanılacak fotoğraf
  } catch (error) {
    res.status(500).send(`Dosya yükleme hatası: ${error}`);
  }
};

   export default uploadFile;
