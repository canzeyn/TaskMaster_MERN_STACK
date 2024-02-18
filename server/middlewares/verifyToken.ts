import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import mongoose from "mongoose";

interface CustomJwtPayload extends JwtPayload {
  // jwt paketinden gelen JwtPayload tipini kullanıyoruz ve bu tip ekstra olarak CustonJwtPayload inmterfaceinide kapsıyor ekleniyor yani id değeri ekleniyopr string olarak
  id: string;
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Cookies:", req.cookies); //istek ile gelen  cookies içindekiler yazıdırılıyor console içine
  const token = (req as any).cookies.token; // cookies içindeki token başlığı altındaki token bilgisi token değişkenine atılıyor

  if (!token) {
    // eğer token ile ilgili bir sorun olursa kodlar çalışır
    return res
      .status(403)
      .send({ message: " (verifyToken.ts) Token gerekli." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload; // verify fonksiyonu ile token çözülür ve içindeki bilgiler alınır çözülürkne sunucudaki key kullanılır eğer keyde hata varsa token çözülmez
    // döndürülen değerin tipi JwtPayload tipindedir

    console.log("Decoded ID:", decoded.id);
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      // decoded false değer döndğrğse kodlar çalışır eğer tru ise bir sonraki dğer olan decoded tipinine bakılır eğer tipi object değilse kodlar çalışır son olarakda decoded içinden id değerine bakılır eğer false dönerse kodlar çalışır
      // hata yakalama için yapılır bu kısım
      return res
        .status(403)
        .send({ message: " (veriyToken.ts) Token geçerli değil." });
    }

    //(req as any).userId = Buffer.from(decoded.id).toString("hex"); // Buffer.from ile içine girilen nesneyi alır ve buffer tipine çevirir ardından bu tipide hex stirngine çevirir ve istek nesnesine eklenir kullanıcın id değeri bu sayede diğer middlewarelerden de ulaşılabilir bu değere

    (req as any).userId = decoded.id.toString("hex");

    if (!mongoose.Types.ObjectId.isValid(decoded._id)) {
      // return res.status(400).send({ message: "Geçersiz id formatı." });
      console.log("yanlış format id değeri");
    } else {
      console.log("dopru formatta id değeri");
    }

    console.log("Decoded JWT:", decoded); // çözülen tokeni console a yazdırır
    try {
      const user = await User.findById(decoded.id).exec(); // .exec() sorguyu bir Promise olarak çalıştırır
      // veri tabanında kullanıcı bulunuyor id değerine göre
      console.log(user);

      if (!user) {
        // kullanıcı bulunamazsa kodlar çalışır
        return res.status(404).send({ message: "Kullanıcı bulunamadı." });
      } else {
        // kullanıcı varsa bu kodlar çalışıyor amaç şu kullanıcın role değeri undefined veya null ise kodlar çalışıyor ve role değeri olmadığını söylüyor
        if (typeof user.role === "undefined" || user.role === null) {
          console.log("role değeri yok bu kullanıcının");
        } else {
          (req as any).userRole = user.role; // eğer role değeri varsa istek nesnesi içine ekliyor bu role değerini ve artık istek nesnesi içine userRole ile bu değere ulaşılabilir routes kısmında client taarafa gönderilicek bu isimle role değeri
          console.log("Kullanıcının rolü:", user.role); // Rol bilgisi varsa console'a yazdır
        }
      }

      const userObj = user.toObject(); // mongoDB veri tabanından gelen verileri alır bu verileri bir belge tipindedir ve bir javascript objesine çevirir toObject() methodu ile  bu sayede içerisindeki verilere erşililebilir javasript fonksiyonları ile işlemler yapılabilir
      console.log("Role:", userObj.role);

      if (!userObj.role) {
        console.log("role dğeri yok bu kullanıcının");
      } else {
        (req as any).userRole = userObj.role;
      }
    } catch (err) {
      // Veritabanı sorgusunda hata yakalama
      console.error("Veritabanı sorgusu sırasında hata:", err);
      return res.status(500).send({ message: "Sunucu hatası." });
    }
    next();
  } catch (err) {
    console.error("Token doğrulanamadı:", err);
    return res
      .status(403)
      .send({ message: " (verifyToken.ts) Token geçersiz." });
  }
};

export default verifyToken;
