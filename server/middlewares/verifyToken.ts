import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

require('dotenv').config();


// JWT middleware fonksiyonu
const verifyToken = (req: Request, res: Response, next: NextFunction) => { // giriş yaoan kullanıcının bilgilerini almak için kimin giriş yaptığını anlamak için
    const token = req.cookies.token; // cookies içinden tokene ulaşılıyor 

  if (token) { 
    jwt.verify(token, process.env.JWT_SECRET || '', (err: any, decoded: any) => { // token doğrulanıyor ve içerisindeki tüm bilgiler çıkarlıyor eğer hata olursa err ile hata gösterliyor sorun olmazsa tüm bilgiler decoded içine atılıyor token callback function ile çıkartılıyor
      if (err) { // hata varsa kodlar çalışır 
        return res.status(403).send({ message: 'Token geçersiz.' });
      } else {
        (req as any).user = decoded; // Kullanıcı bilgilerini istek nesnesine ekleniyor decoded as UserPayload ile decodedın UserPayload tipinde olduğunu belirtiyoruz
        // token üretilirken user adında bir nesne oluşturuluyor ve bu nesneye id ve role değerleri gönderiliyor 
        //burada gelen isteğin user nesnesi içine tokenin içindeki bilgiler açılır ve atılır
        next(); // Sonraki middleware'e geç
      }
    }); 
  } else {
    return res.status(403).send({ message: 'Token gerekli.' });
  }
};

export default verifyToken;
