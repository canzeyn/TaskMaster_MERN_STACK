import mongoose , {Schema , Document} from 'mongoose';

interface IUser extends Document { //typescripten gelen interface ile nesnenin içerisini belirliyoruz artık oluşturulan model bu interface tipine göre oluturulacak
    name: string;
    email: string;
    password: string;
    profilePictureUrl?: string;
    createdAt: Date;
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Email adresinin benzersiz olması gerektiğini belirtiyoruz.
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], // E-posta adresi için basit bir regex kontrolü
    },
    password: {
        type: String,
        required: true,
      },
      profilePictureUrl: {
        type: String,
        required: false // Bu alan zorunlu değil, çünkü kullanıcı bir profil fotoğrafı yüklemediyse bu alan boş olabilir.
      },
      createdAt: {
        type: Date,
        default: Date.now, // Varsayılan değer olarak şu anki zamanı atıyoruz.
      },
}) 

const User = mongoose.model<IUser>('User', userSchema); // User adlı collection içine userSchema dan verileri ekler ve kullanıcı oluşur <IUser> ile interface tipinde olduğunu belirtiyoruz
export default User;