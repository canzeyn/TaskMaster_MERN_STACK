import mongoose, { Schema, Document } from "mongoose";
import setDefaultMiddleware from "../middlewares/setDefaultMiddleware";

interface IUser extends Document {
  //typescripten gelen interface ile nesnenin içerisini belirliyoruz artık oluşturulan model bu interface tipine göre oluturulacak
  name: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
  createdAt: Date;
  role: string;
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email adresinin benzersiz olması gerektiğini belirtiyoruz.
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ], // E-posta adresi için basit bir regex kontrolü
  },
  password: {
    type: String,
    required: true,
  },
  profilePictureUrl: {
    type: String,
    required: false, // Bu alan zorunlu değil, çünkü kullanıcı bir profil fotoğrafı yüklemediyse bu alan boş olabilir.
  },
  createdAt: {
    type: Date,
    default: Date.now, // Varsayılan değer olarak şu anki zamanı atıyoruz.
  },
  role: { // hata var eklenmiyor bu alan çözülemedi
    type: String,
    required: true,
    enum: ['admin', 'user', 'guest'],
  },
});


const User = mongoose.model<IUser>("User", userSchema); // User adlı collection içine userSchema dan verileri ekler ve kullanıcı oluşur <IUser> ile interface tipinde olduğunu belirtiyoruz
export default User;
