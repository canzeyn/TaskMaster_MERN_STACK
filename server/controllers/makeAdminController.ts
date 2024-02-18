import User from "../models/userModel";
import { Request, Response } from "express";

// Kullanıcı rolünü 'admin' olarak güncelleyen controller fonksiyonu
const makeAdmin = async (req: Request, res: Response) => {
  const userId = req.params.id; // sunucya atılan istekteki parametredeki id değeri alınıyor

  try {
    // Kullanıcıyı bul ve rolünü 'admin' olarak güncelle
    console.log("admin olacak olan kişi idsi:" , userId)
    const updatedUser = await User.findByIdAndUpdate( // id değeri ile bunuyor kullanıcı ve değiştirilecek olan alan değiştiriliyor
      userId,  // client taraftan gelen id değeri
      { role: "admin" }, // payload olarak role değerine admin değeri atanıyor o kullanıcıya
      { new: true } // o an yapılıyor değişiklik hızlıca
    );

    if (!updatedUser) { //user bulunanamışsa kodlar çalışır 
      return res.status(404).json({ message: " makeAdminController.ts: Kullanıcı bulunamadı" });
    }

    return res.status(200).json({
      message: "Kullanıcı başarıyla admin yapıldı",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "makeAdminController.ts: Sunucu hatası",
      error,
    });
  }
};

export default makeAdmin;
