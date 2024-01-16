// userController.ts
import express ,  { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from "bcrypt";
import { generateToken } from '../middlewares/authMiddleware';

export  const userController = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body; //burada client tarafta form etiketleri içinde olan veriler json formatında req.body içinde yer alır 

        const existingUser = await User.findOne({ email }); // burada findone metodu ile email in var olup olmadığı yani önceden bu email ile hesap oluşturulup oluşturulmadığına bakılıyor findone metodu veri tabanında istenilen koşulu sağlayan ilk veriyi bulur ve getirir
        if (existingUser) {  //veri önceden kullanılmışsa kodlar çalışır
            return res.status(400).json({ // 400 hatası istemci tarafında hata olduğunu söyleyen durum kodudur 
                message: "E-posta adresi zaten kullanılıyor"
            });
        }

        const saltRounds = 10; // Tuzlama turu, güvenlik seviyesini belirler
        const hashedPassword = await bcrypt.hash(password, saltRounds); 

        const newUser = new User({ name, email, password: hashedPassword , role:'user' });  // userModel sayfasında tanımlanan modele göre bir model oluşturur req.body ile client tarafından gelen veriler bu modele gönderirlr ve bir tane oluşturulur

        console.log("Kullanıcı kaydetmeden önce:", newUser); // Kaydetmeden önceki durum
        await newUser.save(); // mongoose kütüphanseinde gelen save metodu ile oluşturulan model mongodb içine kaydedilir
        console.log("Kullanıcı başarıyla kaydedildi:", newUser); // Başarılı kayıttan sonra

        const token = generateToken({id:newUser.id , role:newUser.role }) // authMiddlewareden gelen generateToken adlı fonksiyon ile her kullanıcı oluşturulduktan sonra o kullanıcıya bir token üretir 
        //biz burada bu token içine kullanıcın benzersiz idsini ve yetkisini tanımlıyoruz her kullanıcı ilk oluşturduğu zaman hesabını yetkisi default olarak user olacak
        

        res.status(201).json({ // 201 durum kodu isteğin başarıyla tamamlandığını ve sonucunda yeni bir kaynak(veri tabanı oluşturulduğunu) gösterir 
            message: "Kullanıcı başarıyla oluşturuldu",
            user: newUser,
            token:token,
            role:'user'
        });
    } catch (err) {
        res.status(500).json({ //burada 500 durum kodu beklenmeyen hatalarda kullanılır
            message: "Kullanıcı oluşturulurken hata oldu",
            error: err
        });
    }
};
