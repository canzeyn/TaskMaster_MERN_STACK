import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

require('dotenv').config(); // .env dosyasından gelecek olan bilgiler için gerekli olan paket

const JWT_SECRET: string | undefined  = process.env.JWT_SECRET // kullanıcının oluşturduğu tokenin imzalanması için kullanılacak

  if(!JWT_SECRET) { // eğer jwt secret kodu bulunamazsa kodlar çalışır
    throw new Error('(authMiddleware.ts) JWT_SECRET is not defined'); // throw ile hata mesajı gönderilir
  }

 export const generateToken = (id:string) => { // token üretemesi için fonksiyondır parametre olarak girilen user  değerine özellik olarak id değeri içierdiğini ve onunda string tipinde olduğunu belirtiyoruz

   return jwt.sign({id} , JWT_SECRET , {expiresIn: '1d'}) // sign ile yeni bir token oluşturulur bu token 3 parametre alır  ilk kısım token içinde taşıyacağı veriyi gösteriri burada mongodb den gelen her kullanıcı için benzersiz olarak üretilen user.id değeri bu ilk veri paylaod olarak adlandırılır
   // jwt secret ile suncuya gelen bu token yaratma isteği doğrulanır eğer sunucu içindeki key ile gelen key farklı ise token üretilmez güvenlik için önemlidir 
   // expiresIn ilede tokenin geçerlilik süresi ayarlanır burada 1d ile 1 gün ayarlanmıştır
 }
