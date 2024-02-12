import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { generateToken } from "../middlewares/authMiddleware";

export const signinController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // giriş sayfasından girilen veriler alınıyor

    const user = await User.findOne({ email }); // emailin var olup olmadığına bakılıyor ve use içine atılıyor

    if (!user) {
      // eğer user false değer dönerse kodlar çalışır
      return res.status(401).json({ message: " (signinController.ts) kullanıcı bulunamadı" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // girilen passwordu hashler ve veri tabanındaki haslenen şifreyle karşılaştırır aynı ise true değer döner

    if (!isMatch) {
      // isMatch false ise kodlar çalışır
      return res.status(401).json({ message: " (signinController.ts) yanlış şifre" });
    }
  
    const token = generateToken(user._id);

    res.cookie("token", token, { // bu token tüm isteklerle gönderilir sunucya tekrar client taraftan ilk olarak web içinde cookies e kaydedilir ardından bu token aktif olduğu sürece her istek ile client taraftan sunucuya gönderilir
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS üzerinde çalışırken true olmalı
      maxAge: 3600000, // 1 saat (milisaniye cinsinden)
    });

    res.json({
      _id: user.id,
      email: user.email,
      token: token,
      message: "başarılı giriş",
    });
  } catch (error) {
    res.status(500).json({ messsage: " (signinController.ts) sunucu hatası" });
  }
};
