import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('Cookies:', req.cookies); //istek ile gelen  cookies içindekiler yazıdırılıyor console içine  
  const token = (req as any).cookies.token; // cookies içindeki token başlığı altındaki token bilgisi token değişkenine atılıyor

  if (!token) { // eğer token ile ilgili bir sorun olursa kodlar çalışır
    return res.status(403).send({ message: "Token gerekli." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || ''); // verify fonksiyonu ile token çözülür ve içindeki bilgiler alınır çözülürkne sunucudaki key kullanılır eğer keyde hata varsa token çözülmez
    
    if (!decoded || typeof decoded !== 'object' || !decoded.id) { // decoded false değer döndğrğse kodlar çalışır eğer tru ise bir sonraki dğer olan decoded tipinine bakılır eğer tipi object değilse kodlar çalışır son olarakda decoded içinden id değerine bakılır eğer false dönerse kodlar çalışır
      // hata yakalama için yapılır bu kısım
      return res.status(403).send({ message: "Token geçerli değil." });
    }
    (req as any).userId = Buffer.from(decoded.id).toString('hex'); // Buffer.from ile içine girilen nesneyi alır ve buffer tipine çevirir ardından bu tipide hex stirngine çevirir ve istek nesnesine eklenir kullanıcın id değeri bu sayede diğer middlewarelerden de ulaşılabilir bu değere
    console.log("Decoded JWT:", decoded); // çözülen tokeni console a yazdırır
    next();
  } catch (err) {
    console.error("Token doğrulanamadı:", err); 
    return res.status(403).send({ message: "Token geçersiz." });
  }
};

export default verifyToken;