import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

export function valideSignUp(req: Request , res: Response , next: NextFunction) {
    const {email, password , name} = req.body;

    const errors = [];

    if(!validator.isEmail(email)) {
        errors.push("geçersiz posta");
    }

    if (!validator.isLength(password, { min: 6 })) {
        errors.push("Parola en az 6 karakter olmalıdır.");
      }

      if (name && !validator.isAlpha(name, 'tr-TR', { ignore: '' })) { // Türkçe karakter desteği ve boşlukları yoksay
        errors.push("İsim sadece harflerden oluşmalıdır.");
      }

      if (errors.length) {
        return res.status(400).json({ errors });
      }

      next();
}