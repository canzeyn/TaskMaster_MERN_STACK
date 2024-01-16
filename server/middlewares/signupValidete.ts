import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

export function valideSignUp(req: Request , res: Response , next: NextFunction) {
  const { email, password, name } = req.body;

  const errors: string[] = []; //hatalar bu dizide tutulacak ve bu diziden client tarafa gönderilecek

    if(!validator.isEmail(email)) { //validator adlı paketten gelen isEmail ile email uyuyor mu diye kontrol ediliyor !validator.isEmail ile eğer geçersiz ise email kodlar çalışır
        errors.push("geçersiz posta"); // geçersiz ise email hata mesajı errors adlı diziye gönderilir
    }

    if (!validator.isLength(password, { min: 6 })) { // eğer girilen şifre 6 karakterden az is hata verdiriyor 
        errors.push("Parola en az 6 karakter olmalıdır.");
      }

      if (!validator.isAlpha(name, 'tr-TR', { ignore: ' ' })) { // isAlpha ile namein sadece string ifadelerden oluşup olumadığını ve türkçe karakterleden olıuşmadığını kontrol eder ignor ilede boşluk varsa atlanır kontrol edilmez
        errors.push("İsim sadece harflerden oluşmalıdır.");
      }

      if (errors.length) { // erros adlı dizide hata varsa kod bloğu çalışır
        return res.status(400).json({ errors }); // response cevap olarak 400 döner bu bad request yani kullanıcının gönderdiği istekte bir problem olduğunu gösterir  erros adlı dizideki hatalarıda json formatında yanıt olarak gönderir
      }

      next(); // middlwarein bittiğini ve diğerine geçiş için next fonksiyonu kullanılır kullanılmazsa diğer middlewarelere geçiş olmaz
}