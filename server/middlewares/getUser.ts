import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId; // sunucuya gelen istekteki userId değerini alıp bir değişkene atıyoruz
  // userId istek nesnesine başka bir middleware tarafından atılıyor

  try {
    const user = await User.findById(userId).exec(); // User modelinden yani mongodb içindeki users adlı collection içinde istek ile gelen userId değeri ile eşleşen kişinin verileri getirlir o collection içindeki findByid o id değerini bulur exec ile bu sorgu çalıltırır ayrıca exec promise değer döndüğrü bu sayede asenkron işlem yapılabilr ve hata yakalaması kolaylaşır
    if (!user) { // user false ise kodlar çalışır
      return res.status(404).send({ message: "Kullanıcı bulunamadı." });
    }
    // Kullanıcı bilgilerini istek nesnesine ekleyin
    (req as any).user = user; // istek nesnesine kullanıcın bilgileri atılır
    next();
  } catch (error) {
    console.error("Kullanıcı bilgileri çekilirken hata:", error);
    return res.status(500).send({ message: "Sunucu hatası." });
  }
};

export default getUser;
