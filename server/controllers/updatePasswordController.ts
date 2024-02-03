import {Request ,Response} from "express";
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); 

 const updatePasswordController = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
   
    const user = await User.findById((req as any).user._id); // istek nesnesi içinde gelen user nesnesi içindeki _id değerine erişiliyor bu benzersiz bir id her kullanıcıya özel bu sayede hangi kullanıcının şifresinin değiştirileceği bulunuyor

    if (!user) { // kullanıcı bulunamazsa kodlar çalışır
      return res.status(404).json({ message: "updatePasswordController: Kullanıcı bulunamadı" });
    }


    const isMatch = await bcrypt.compare(currentPassword, user.password); //girilen şifrenin veri tabanındaki şifre ile karşılaştırılıyor eğer aynı ise true değer döner 

    if (!isMatch) { // eğer karşılaştırılan şifreler aynı değilse kodlar çalılır
      return res.status(400).json({ message: "updatePasswordController: Mevcut şifre yanlış" });
    }

    
    const salt = await bcrypt.genSalt(10); // girilen yeni şifre rastgele gizleniyor  
    const hashedPassword = await bcrypt.hash(newPassword, salt); // şifre hashleniyor

   
    user.password = hashedPassword; // kullanıcının eski şifresi yerine yeni haskenen şifre ekleniyor
    await user.save(); // ve user kaydedilir veri tababnına

    res.status(200).json({ message: "Şifre başarıyla güncellendi" });
  } catch (error) {
    res.status(500).json({ message: "updatePasswordController: Sunucu hatası", error });
  }
};

export default updatePasswordController;
