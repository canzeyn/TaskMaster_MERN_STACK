import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";

require('dotenv').config();

export const authorize = (roles: string[]) => {
  // bu middleware ile jwt kısmında yetkilendirme yapıyoruz admin gibi basic user gibi kimlerin nereye geçebileceğini ve ne görebileceğini ayarlaması yapılıyor bu fonksiyon ile
  // hangi rollerin geçebielceğini roles adlı dizi içinde tutuyoruz

  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization; //req kısmı http isteğinin tamamıdır
    // http isteğinin headers adlı kısım http isteğinin başlığıdır
  

    if (!authHeader) {
      // eğer başlıkta authorizatio n  yoksa çalışır kodlar
      return res.status(401).json({ message: " (authorizeMiddleware.ts) yetkilendirme tokeni eksik" }); // 401 ile yetkilendirme tokeni eksik hatası gönderilir
    }

    const token = authHeader.split(' ')[1];  // split ile bearer <token> ile arasındaki boşlupğu alır ve ondan sonra gelen tokeni alır orada kullanıcın yetkisi bulunur

  

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // gelen tokeni doğrulamak için verfy adlı fonksiyon kullanılır
      // doğrulanan tokenden içindeki veriyi çıkartır ve geri döndürür token içine eklenen verileri bu durumda id değeri ve yetki durumunu çıkartır

      if (!roles.includes((decoded as any).role)) { // as any ile typescripte tip tanımı yapılmak zorunda fakat decoded ın tipini bilmiyoruz bundan dolayı any kullanılıyor yani herhangi bir tip olabilir 
        return res.status(403).json({ message: " (authorizeMiddleware.ts) bu işlem için yetkiniz yok" });
      }

      (req as any).user = decoded; // gelen isteğe token içindeki bilgileri ekler
      next(); // bir sonraki middleware geçilmesini sağlar
    } catch (error) {
      return res.status(401).json({ message: " (suthorizeMiddleware.ts) geçersiz token" });
    }
  };
};




